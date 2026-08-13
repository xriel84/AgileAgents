/**
 * deck/modules/brain.js — quadrant diamond, content-free
 *
 * Source: AL-v8.html openBrain/selectBot/renderBrainView/animateBrainQuadrantsEntrance
 *         (L2825-3070), brainQHover/brainQUnhover/clickQuadrant (L3035-3070)
 *
 * Contract:
 *  - Quadrant count and keys come from data, not hardcoded.
 *  - Portrait gate: show portrait first, click triggers disassemble → quadrant reveal.
 *  - Hover/click swap: hover plays reaction asset, click triggers schematic.
 *  - build*Schematic functions are NOT ported — they are content payload.
 *  - CLAWDBOT_VULNS, GPU_TIERS, LLM_STATS are NOT ported — content payload.
 */

/* ── State ─────────────────────────────────────────────────── */
let _currentKey = null;
let _quadrantBusy = false;

/* ── Config set by initBrain() ──────────────────────────────── */
let _cfg = {
  /** Container element id for the brain overlay */
  overlayId: "brainOverlay",
  /** Element id of the portrait container (created if absent) */
  portraitContainerId: "brainBotPortrait",
  /** Element id of the quadrant grid */
  quadrantsId: "brainQuadrants",
  /**
   * Quadrant descriptor array — order determines layout.
   * Each entry: { key, cssClass, imgId, labelId }
   * The module generates DOM from this; caller provides the element IDs.
   */
  quadrants: [],
  /**
   * Data provider callbacks — all return undefined-safe values.
   * getPortraitUrl(key)     → { idle, still, disassemble }
   * getQuadrantAsset(key, quadKey) → { idle, reaction }
   * onQuadrantClick(key, quadKey)  → void  (caller opens schematic)
   * onClose()                      → void
   */
  getPortraitUrl: null,
  getQuadrantAsset: null,
  onQuadrantClick: null,
  onClose: null,
  /** GSAP reference — optional */
  gsap: null,
};

/**
 * Initialise the brain module.
 * @param {object} cfg — see _cfg shape above
 */
function initBrain(cfg) {
  Object.assign(_cfg, cfg);
}

/**
 * Open the brain overlay for a given key.
 * Shows the portrait gate first; click on portrait triggers disassemble.
 */
function openBrain(key) {
  if (!key) return;
  _currentKey = key;
  const overlay = document.getElementById(_cfg.overlayId);
  if (overlay) overlay.classList.add("active");
  _showPortrait(key);
}

/** Close the brain overlay. */
function closeBrain() {
  const overlay = document.getElementById(_cfg.overlayId);
  if (overlay) overlay.classList.remove("active");
  _currentKey = null;
  if (_cfg.onClose) _cfg.onClose();
}

/* ── Portrait gate ──────────────────────────────────────────── */

function _showPortrait(key) {
  const quadrants = document.getElementById(_cfg.quadrantsId);
  if (quadrants) {
    quadrants.style.display = "none";
    quadrants.style.opacity = "1";
  }

  const gsap = _cfg.gsap;

  if (gsap) {
    gsap.killTweensOf("#" + _cfg.quadrantsId);
    gsap.killTweensOf(".brain-q");
    gsap.killTweensOf("#" + _cfg.portraitContainerId);
  }

  let portrait = document.getElementById(_cfg.portraitContainerId);
  if (!portrait) {
    portrait = document.createElement("div");
    portrait.id = _cfg.portraitContainerId;
    portrait.style.cssText =
      "text-align:center;cursor:pointer;position:relative;";
    if (quadrants) quadrants.parentNode.insertBefore(portrait, quadrants);
  }

  const assets = _cfg.getPortraitUrl ? _cfg.getPortraitUrl(key) : {};
  const idleSrc = assets.idle || "";
  const stillSrc = assets.still || "";

  portrait.innerHTML = `<img id="_brainPortraitImg" src="${idleSrc}" style="max-height:400px;object-fit:contain;border-radius:6px;" />`;
  portrait.style.display = "block";
  portrait.style.opacity = "1";
  portrait.style.cursor = "pointer";

  const img = document.getElementById("_brainPortraitImg");
  if (img && stillSrc) {
    let _autoTimer = setTimeout(() => {
      img.src = stillSrc;
    }, 3000);
    portrait.onmouseenter = () => {
      clearTimeout(_autoTimer);
      img.src = idleSrc + "&t=" + Date.now();
    };
    portrait.onmouseleave = () => {
      img.src = stillSrc;
    };
    portrait.onerror = () => {
      if (stillSrc) img.src = stillSrc;
    };
  }

  portrait.onclick = () => {
    _triggerDisassemble(key, portrait, quadrants);
  };
}

function _triggerDisassemble(key, portrait, quadrants) {
  const assets = _cfg.getPortraitUrl ? _cfg.getPortraitUrl(key) : {};
  const disSrc = assets.disassemble || "";
  const img = document.getElementById("_brainPortraitImg");
  const gsap = _cfg.gsap;

  portrait.onmouseenter = null;
  portrait.onmouseleave = null;
  portrait.onclick = null;
  portrait.style.cursor = "default";

  const reveal = () => {
    portrait.style.display = "none";
    portrait.style.opacity = "1";
    if (quadrants) {
      quadrants.style.display = "";
    }
    _renderQuadrants(key);
    _animateEntrance();
  };

  if (disSrc && img && gsap) {
    img.src = disSrc + "&t=" + Date.now();
    setTimeout(() => {
      gsap.to(portrait, { opacity: 0, duration: 0.4, onComplete: reveal });
    }, 1800);
  } else {
    reveal();
  }
}

/* ── Quadrant grid ──────────────────────────────────────────── */

function _renderQuadrants(key) {
  const el = document.getElementById(_cfg.quadrantsId);
  if (!el) return;
  el.style.opacity = "1";

  _cfg.quadrants.forEach((q) => {
    const img = document.getElementById(q.imgId);
    if (!img) return;
    const asset = _cfg.getQuadrantAsset
      ? _cfg.getQuadrantAsset(key, q.key)
      : null;
    if (asset && asset.idle) img.src = asset.idle;
  });
}

/* §2A: Entrance animation — icons fly from center to final CSS positions */
function _animateEntrance() {
  const gsap = _cfg.gsap;
  if (!gsap) return;

  const quads = document.querySelectorAll(".brain-q");
  quads.forEach((q) => {
    gsap.set(q, { clearProps: "all" });
    gsap.set(q, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 0.5,
      opacity: 0,
    });
  });

  const lastIndex = quads.length - 1;
  quads.forEach((q, i) => {
    /* Final position is encoded as data attributes set by caller's CSS class.
     * We read the computed CSS position after a brief gsap.set(clearProps) below.
     * Fallback: evenly distribute around center using angle. */
    const angle = (i / quads.length) * 2 * Math.PI;
    const finalPos = _readFinalPosition(q) || {
      top: 50 + 35 * Math.sin(angle) + "%",
      left: 50 + 35 * Math.cos(angle) + "%",
      xPercent: -50,
      yPercent: -50,
    };
    gsap.to(q, {
      ...finalPos,
      scale: 1,
      opacity: 1,
      duration: 1,
      delay: i * 0.1,
      ease: "back.out(1.4)",
      onComplete:
        i === lastIndex
          ? () => {
              quads.forEach((el) => gsap.set(el, { clearProps: "all" }));
            }
          : undefined,
    });
  });
}

/**
 * Read the intended final position from data attributes on the element.
 * Caller marks elements with data-brain-top, data-brain-left, etc.
 * Returns null if attributes are absent.
 */
function _readFinalPosition(el) {
  const top = el.dataset.brainTop;
  const left = el.dataset.brainLeft;
  const xp = el.dataset.brainXpercent;
  const yp = el.dataset.brainYpercent;
  if (!top || !left) return null;
  return {
    top,
    left,
    xPercent: xp !== undefined ? Number(xp) : -50,
    yPercent: yp !== undefined ? Number(yp) : -50,
  };
}

/* ── Hover / click handlers (attach to quadrant elements) ────── */

/** Call from element's onmouseenter. */
function brainQHover(quadKey) {
  if (!_currentKey || !_cfg.getQuadrantAsset) return;
  const q = _cfg.quadrants.find((x) => x.key === quadKey);
  if (!q) return;
  const img = document.getElementById(q.imgId);
  const asset = _cfg.getQuadrantAsset(_currentKey, quadKey);
  if (img && asset && asset.reaction) img.src = asset.reaction;
}

/** Call from element's onmouseleave. */
function brainQUnhover(quadKey) {
  if (!_currentKey || !_cfg.getQuadrantAsset) return;
  const q = _cfg.quadrants.find((x) => x.key === quadKey);
  if (!q) return;
  const img = document.getElementById(q.imgId);
  const asset = _cfg.getQuadrantAsset(_currentKey, quadKey);
  if (img && asset && asset.idle) img.src = asset.idle;
}

/** Call from element's onclick. Fades quadrants, fires onQuadrantClick. */
function clickQuadrant(quadKey) {
  if (_quadrantBusy) return;
  _quadrantBusy = true;
  const gsap = _cfg.gsap;
  const done = () => {
    if (_cfg.onQuadrantClick) _cfg.onQuadrantClick(_currentKey, quadKey);
    _quadrantBusy = false;
  };
  if (gsap) {
    gsap.to("#" + _cfg.quadrantsId, {
      opacity: 0,
      duration: 0.4,
      onComplete: done,
    });
  } else {
    done();
  }
}

export {
  initBrain,
  openBrain,
  closeBrain,
  brainQHover,
  brainQUnhover,
  clickQuadrant,
};

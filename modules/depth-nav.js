/**
 * deck/modules/depth-nav.js — five-depth drill engine, content-free
 *
 * Source: mfa-building.html drill engine (L2524-3560)
 *         AL-v8.html zoomTransition used in transitions.js; drillUp/drillDown here.
 *
 * Contract:
 *  - Zero content strings. No agent names, floor names, labels.
 *  - All display text comes from the `labels` data object passed to init().
 *  - Depths: 0=building, 1=floor, 2=office, 3=desk, 4=head
 */

/* ── State ─────────────────────────────────────────────────── */
let _depth = 0;
let _isTransitioning = false;
let _currentFloor = null;
let _currentAgent = null;

/* ── Config set by init() ───────────────────────────────────── */
let _cfg = {
  /* Required element IDs per depth — caller populates DOM */
  depthEls: [], // ['depth-wide','depth-floor','depth-office','depth-desk','depth-head']
  sceneClasses: [], // ['.wide-scene','.floor-scene','.office-scene','.desk-scene','.head-scene']
  backBtnId: "back-btn",
  breadcrumbId: "breadcrumb",
  /* Callbacks — all optional */
  onDrill: null, // (toDepth, meta) => void
  onBack: null, // (fromDepth) => void
  onBreadcrumbClick: null, // (toDepth) => void
  /* Label provider — returns display text for breadcrumb at each depth */
  getLabel: null, // (depth) => string
  /* GSAP reference — optional; CSS fallback used if absent */
  gsap: null,
};

/**
 * Initialise the engine.
 * @param {object} cfg — see _cfg shape above
 */
function initDepthNav(cfg) {
  Object.assign(_cfg, cfg);
  _bindBackButton();
  _bindKeyboard();
}

/* ── Public API ─────────────────────────────────────────────── */

/** Current drill depth (0–4). */
function getDepth() {
  return _depth;
}

/** True while a transition animation is in progress. */
function isTransitioning() {
  return _isTransitioning;
}

/**
 * Drill one level deeper.
 * @param {object} meta — arbitrary data passed to onDrill (floor id, agent id, etc.)
 */
function drillDown(meta) {
  if (_isTransitioning || _depth >= 4) return;
  const from = _el(_depth);
  const to = _el(_depth + 1);
  if (!from || !to) return;

  _isTransitioning = true;
  const nextDepth = _depth + 1;

  if (meta && meta.floor !== undefined) _currentFloor = meta.floor;
  if (meta && meta.agent !== undefined) _currentAgent = meta.agent;

  _animateDown(from, to, _sceneClass(_depth), () => {
    _depth = nextDepth;
    _isTransitioning = false;
    _updateBack();
    _updateBreadcrumb();
    if (_cfg.onDrill) _cfg.onDrill(_depth, meta);
  });
}

/**
 * Drill one level up.
 */
function drillUp() {
  if (_isTransitioning || _depth <= 0) return;
  const from = _el(_depth);
  const to = _el(_depth - 1);
  if (!from || !to) return;

  _isTransitioning = true;
  const prevDepth = _depth - 1;

  _animateUp(from, to, _sceneClass(_depth - 1), () => {
    _depth = prevDepth;
    if (_depth === 0) {
      _currentFloor = null;
      _currentAgent = null;
    }
    if (_depth <= 1) {
      _currentAgent = null;
    }
    _isTransitioning = false;
    _updateBack();
    _updateBreadcrumb();
    if (_cfg.onBack) _cfg.onBack(_depth);
  });
}

/**
 * Jump to an arbitrary shallower depth by chaining drillUp calls.
 * @param {number} targetDepth
 */
function jumpToDepth(targetDepth) {
  if (_isTransitioning || targetDepth >= _depth) return;
  const step = () => {
    if (_depth <= targetDepth || _isTransitioning) return;
    drillUp();
    const poll = setInterval(() => {
      if (!_isTransitioning) {
        clearInterval(poll);
        if (_depth > targetDepth) step();
      }
    }, 100);
  };
  step();
}

/** Current floor value set by last drillDown with meta.floor. */
function getCurrentFloor() {
  return _currentFloor;
}

/** Current agent value set by last drillDown with meta.agent. */
function getCurrentAgent() {
  return _currentAgent;
}

/* ── Breadcrumb ─────────────────────────────────────────────── */

function _updateBreadcrumb() {
  const bc = document.getElementById(_cfg.breadcrumbId);
  if (!bc) return;
  if (_depth <= 0) {
    bc.classList.remove("visible");
    return;
  }

  const gl = _cfg.getLabel || (() => "");
  const sep = '<span class="bc-sep">›</span>';
  let h = `<span onclick="_deckNav.jumpToDepth(0)">${gl(0)}</span>`;

  for (let d = 1; d <= _depth; d++) {
    h += sep;
    const label = gl(d);
    h +=
      d === _depth
        ? `<span class="bc-current">${label}</span>`
        : `<span onclick="_deckNav.jumpToDepth(${d})">${label}</span>`;
  }

  bc.innerHTML = h;
  bc.classList.add("visible");
}

/* ── Back button ─────────────────────────────────────────────── */

function _bindBackButton() {
  const btn = document.getElementById(_cfg.backBtnId);
  if (!btn) return;
  btn.addEventListener("click", drillUp);
}

function _updateBack() {
  const btn = document.getElementById(_cfg.backBtnId);
  if (!btn) return;
  if (_depth <= 0) {
    btn.classList.remove("visible");
    return;
  }
  btn.classList.add("visible");
  const gl = _cfg.getLabel || (() => "");
  btn.textContent = "← " + (gl(_depth - 1) || "Back");
}

/* ── Keyboard ────────────────────────────────────────────────── */

function _bindKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !_isTransitioning && _depth > 0) drillUp();
  });
}

/* ── Animations ──────────────────────────────────────────────── */

function _animateDown(from, to, sceneClass, done) {
  const gsap = _cfg.gsap;
  if (!gsap) {
    _swapInstant(from, to);
    done();
    return;
  }

  const sceneEl = sceneClass && document.querySelector(sceneClass);
  const tl = gsap.timeline({ onComplete: done });
  if (sceneEl)
    tl.to(sceneEl, { scale: 3, duration: 1.0, ease: "power3.in" }, 0);
  tl.to(from, { opacity: 0, duration: 0.5 }, 0.6)
    .call(() => {
      from.classList.remove("active");
      if (sceneEl) gsap.set(sceneEl, { clearProps: "all" });
      gsap.set(from, { clearProps: "all" });
      gsap.set(to, { clearProps: "all" });
      to.classList.add("active");
    })
    .fromTo(
      to,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
    );
}

function _animateUp(from, to, prevSceneClass, done) {
  const gsap = _cfg.gsap;
  if (!gsap) {
    _swapInstant(from, to);
    done();
    return;
  }

  const tl = gsap.timeline({ onComplete: done });
  tl.to(from, { opacity: 0, duration: 0.5, ease: "power2.in" })
    .call(() => {
      from.classList.remove("active");
      const prevScene =
        prevSceneClass && document.querySelector(prevSceneClass);
      gsap.set(from, { clearProps: "all" });
      gsap.set(to, { clearProps: "all" });
      if (prevScene) gsap.set(prevScene, { clearProps: "all" });
      to.classList.add("active");
    })
    .fromTo(
      to,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
    );
  const prevScene = prevSceneClass && document.querySelector(prevSceneClass);
  if (prevScene) {
    tl.fromTo(
      prevScene,
      { scale: 2 },
      { scale: 1, duration: 0.7, ease: "power2.out" },
      "-=0.6",
    );
  }
}

function _swapInstant(from, to) {
  from.classList.remove("active");
  to.classList.add("active");
}

/* ── Helpers ─────────────────────────────────────────────────── */

function _el(depth) {
  const id = _cfg.depthEls && _cfg.depthEls[depth];
  return id ? document.getElementById(id) : null;
}

function _sceneClass(depth) {
  return (_cfg.sceneClasses && _cfg.sceneClasses[depth]) || null;
}

/* Expose on window for breadcrumb onclick attributes */
const _deckNav = { jumpToDepth };
if (typeof window !== "undefined") window._deckNav = _deckNav;

export {
  initDepthNav,
  getDepth,
  isTransitioning,
  drillDown,
  drillUp,
  jumpToDepth,
  getCurrentFloor,
  getCurrentAgent,
};

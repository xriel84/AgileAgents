/**
 * deck/modules/transitions.js — theatrical/zoom transitions, spotlights, escape stack
 *
 * Source: AL-v8.html theatricalTransition (L3560), zoomTransition (L3596),
 *         updateSpotlights (L3550), escape stack (L5052-5079)
 */

/* ── Shared transition guard ─────────────────────────────────── */
let _isTransitioning = false;
function isTransitioning() {
  return _isTransitioning;
}

/* ── GSAP reference ─────────────────────────────────────────── */
let _gsap = null;
function setGsap(gsapRef) {
  _gsap = gsapRef;
}

/* ── Spotlight config ───────────────────────────────────────── */

/**
 * Drive spotlight opacity by view index.
 * @param {number} viewIdx
 * @param {Array<{warm,cool,accent}>} configs — one entry per view depth
 */
function updateSpotlights(viewIdx, configs) {
  const cfg = (configs && configs[viewIdx]) || {};
  if (!_gsap) return;
  _gsap.to("#spotWarm", { opacity: cfg.warm ?? 0, duration: 0.8 });
  _gsap.to("#spotCool", { opacity: cfg.cool ?? 0, duration: 0.8 });
  _gsap.to("#spotAccent", { opacity: cfg.accent ?? 0, duration: 0.8 });
}

/* ── Theatrical dim transition ──────────────────────────────── */

/**
 * Lights-out blackout swap: dim → silhouettes breathe in dark → swap → lights up.
 * Source: AL-v8.html L3560-3593.
 *
 * @param {Element} fromEl
 * @param {Element} toEl
 * @param {Function} [callback]
 */
function theatricalTransition(fromEl, toEl, callback) {
  if (_isTransitioning) return;
  _isTransitioning = true;

  if (!_gsap) {
    _swapInstant(fromEl, toEl);
    _isTransitioning = false;
    if (callback) callback();
    return;
  }

  const blackout = document.getElementById("transBlackout");
  const silhouettes = document.getElementById("silhouetteRow");

  const tl = _gsap.timeline({
    onComplete: () => {
      _isTransitioning = false;
      if (callback) callback();
    },
  });

  tl.to(blackout, { opacity: 1, duration: 0.4, ease: "power2.in" })
    .to(silhouettes, { opacity: 1, duration: 0.3 }, "-=0.1")
    .call(() => {
      fromEl.classList.remove("active");
      toEl.classList.add("active");
    })
    .to(silhouettes, { opacity: 0, duration: 0.3 }, "+=0.3")
    .to(blackout, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.1");
}

/* ── Zoom-into-building transition ──────────────────────────── */

/**
 * Exterior → Interior: scale building out, fade, then reveal interior.
 * Source: AL-v8.html L3596-3619.
 *
 * @param {Element} fromEl
 * @param {Element} toEl
 * @param {Function} [callback]
 */
function zoomTransition(fromEl, toEl, callback) {
  if (_isTransitioning) return;
  _isTransitioning = true;

  if (!_gsap) {
    _swapInstant(fromEl, toEl);
    _isTransitioning = false;
    if (callback) callback();
    return;
  }

  const tl = _gsap.timeline({
    onComplete: () => {
      _isTransitioning = false;
      if (callback) callback();
    },
  });

  tl.to(fromEl, { scale: 2.5, opacity: 0, duration: 0.8, ease: "power3.in" })
    .call(() => {
      fromEl.classList.remove("active");
      _gsap.set(fromEl, { scale: 1, opacity: 1 });
      toEl.classList.add("active");
    })
    .from(toEl, { opacity: 0, duration: 0.5, ease: "power2.out" });
}

/* ── Escape priority stack ──────────────────────────────────── */

/**
 * Ordered list of { id, test, close } entries.
 * Escape key fires close() on the first entry whose test() returns true.
 *
 * id    — unique string identifier
 * test  — () => boolean — returns true when this layer is open
 * close — () => void    — close this layer
 */
const _escapeStack = [];

/**
 * Register a closeable layer.
 * Layers registered earlier take LOWER priority (are checked later).
 * Use priority parameter to control order: higher number = checked first.
 *
 * @param {string}   id
 * @param {Function} test   — () => boolean
 * @param {Function} close  — () => void
 * @param {number}   [priority=0]
 */
function registerEscapeLayer(id, test, close, priority) {
  _escapeStack.push({ id, test, close, priority: priority ?? 0 });
  _escapeStack.sort((a, b) => b.priority - a.priority);
}

/** Remove a registered layer by id. */
function unregisterEscapeLayer(id) {
  const idx = _escapeStack.findIndex((e) => e.id === id);
  if (idx !== -1) _escapeStack.splice(idx, 1);
}

/** Bind the escape key handler. Call once at page init. */
function bindEscapeKey(fallback) {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    for (const entry of _escapeStack) {
      if (entry.test()) {
        entry.close();
        return;
      }
    }
    if (fallback) fallback();
  });
}

/* ── Helpers ─────────────────────────────────────────────────── */

function _swapInstant(from, to) {
  from.classList.remove("active");
  to.classList.add("active");
}

export {
  isTransitioning,
  setGsap,
  updateSpotlights,
  theatricalTransition,
  zoomTransition,
  registerEscapeLayer,
  unregisterEscapeLayer,
  bindEscapeKey,
};

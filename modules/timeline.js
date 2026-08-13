/**
 * deck/modules/timeline.js — pipeline sequencer, content-free
 *
 * Source: mfa-building.html runPipelineSequence/PIPELINE_STEPS/FLOOR_WORKFLOWS (L6310-6405)
 *
 * Contract:
 *   - Beats supplied as data; no content strings live here.
 *   - Animated beats flow along a path between nodes.
 *   - Node positions and beat data come from caller.
 */

/* ── State ─────────────────────────────────────────────────── */
let _running = false;
let _aborted = false;

/* ── Config ─────────────────────────────────────────────────── */
let _cfg = {
  /**
   * Container element id for the timeline canvas.
   * The module renders SVG path + animated beat dots inside this element.
   */
  containerId: null,
  /**
   * Nodes array — positions on the path.
   * [{ id, label, x, y, color }]
   * x/y are percentages relative to the container (0-100).
   */
  nodes: [],
  /**
   * Beat sequence — data only, no content strings.
   * [{ nodeId, duration, onStart, onEnd }]
   * nodeId   — which node is active during this beat
   * duration — ms the beat holds before advancing
   * onStart  — optional () => void fired when beat begins
   * onEnd    — optional () => void fired when beat ends
   */
  beats: [],
  /** Called when the full sequence completes. */
  onComplete: null,
  /** Called on each beat: (beatIndex, beat) => void */
  onBeat: null,
  /** GSAP reference — optional; setTimeout fallback used if absent */
  gsap: null,
};

function initTimeline(cfg) {
  Object.assign(_cfg, cfg);
  _buildSvg();
}

/* ── Public API ─────────────────────────────────────────────── */

function isRunning() {
  return _running;
}

/**
 * Start the beat sequence from the beginning.
 * Returns immediately; beats play asynchronously.
 */
function runSequence() {
  if (_running) return;
  _running = true;
  _aborted = false;
  _playBeat(0);
}

/** Abort the running sequence. Current beat completes then sequence stops. */
function abortSequence() {
  _aborted = true;
}

/* ── Beat playback ──────────────────────────────────────────── */

function _playBeat(idx) {
  if (_aborted || idx >= _cfg.beats.length) {
    _running = false;
    _aborted = false;
    if (_cfg.onComplete && !_aborted) _cfg.onComplete();
    return;
  }

  const beat = _cfg.beats[idx];
  _activateNode(beat.nodeId);
  _animateBeatDot(beat.nodeId);

  if (_cfg.onBeat) _cfg.onBeat(idx, beat);
  if (beat.onStart) beat.onStart();

  const advance = () => {
    if (beat.onEnd) beat.onEnd();
    _deactivateNode(beat.nodeId);
    _playBeat(idx + 1);
  };

  const gsap = _cfg.gsap;
  if (gsap) {
    gsap.delayedCall(beat.duration / 1000, advance);
  } else {
    setTimeout(advance, beat.duration);
  }
}

/* ── Node activation ────────────────────────────────────────── */

function _activateNode(nodeId) {
  const el = document.getElementById("_tl-node-" + nodeId);
  if (el) el.classList.add("tl-node-active");
}

function _deactivateNode(nodeId) {
  const el = document.getElementById("_tl-node-" + nodeId);
  if (el) el.classList.remove("tl-node-active");
}

/* ── Beat dot animation ──────────────────────────────────────── */

function _animateBeatDot(nodeId) {
  const container = document.getElementById(_cfg.containerId);
  if (!container) return;
  const node = _cfg.nodes.find((n) => n.id === nodeId);
  if (!node) return;

  const dot = document.createElement("div");
  dot.className = "tl-beat-dot";
  dot.style.cssText = `left:${node.x}%;top:${node.y}%;background:${node.color || "#c9a84c"};`;
  container.appendChild(dot);

  const gsap = _cfg.gsap;
  if (gsap) {
    gsap.fromTo(
      dot,
      { scale: 0, opacity: 1 },
      {
        scale: 2.5,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => dot.remove(),
      },
    );
  } else {
    setTimeout(() => dot.remove(), 900);
  }
}

/* ── SVG path builder ────────────────────────────────────────── */

function _buildSvg() {
  const container = document.getElementById(_cfg.containerId);
  if (!container || !_cfg.nodes.length) return;

  /* Draw SVG connecting path through nodes in order */
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "tl-svg");
  svg.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";

  const pathD = _cfg.nodes
    .map((n, i) => (i === 0 ? "M" : "L") + n.x + "% " + n.y + "%")
    .join(" ");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  path.setAttribute("stroke", "rgba(201,168,76,0.25)");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-dasharray", "4 6");
  svg.appendChild(path);
  container.appendChild(svg);

  /* Render node markers */
  _cfg.nodes.forEach((node) => {
    const marker = document.createElement("div");
    marker.id = "_tl-node-" + node.id;
    marker.className = "tl-node";
    marker.style.cssText =
      `left:${node.x}%;top:${node.y}%;` +
      `border-color:${node.color || "var(--gold)"};`;
    if (node.label) {
      const lbl = document.createElement("span");
      lbl.className = "tl-node-label";
      lbl.textContent = node.label;
      marker.appendChild(lbl);
    }
    container.appendChild(marker);
  });
}

export { initTimeline, isRunning, runSequence, abortSequence };

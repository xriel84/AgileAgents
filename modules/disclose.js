/**
 * deck/modules/disclose.js — progressive-disclosure engine
 *
 * Source: shadowharness deck (uploaded); ported from JSX to vanilla JS.
 *
 * Schema per disclosure node:
 *   { sentence, paragraph, deep: { specs: string[], cited: string[] } }
 *
 * Four levels:
 *   1. sentence   — one-liner always visible
 *   2. paragraph  — expanded on click
 *   3. SPECS      — overlay listing specs[] and cited[]
 *   4. RABBIT HOLE — full essay (cited[] rendered as links)
 *
 * Inline markup:
 *   [[key|display]]  — wiki-term panel keyed by `key`, shown as `display`
 *   *word*           — bold pass
 *
 * Contract:
 *   - Node must have sentence AND paragraph or it is invalid.
 *   - No content strings live in this module; all text comes from node data.
 *   - no-autonomy-claim gate applies to consumer nodes, not this module.
 */

/* ── State ─────────────────────────────────────────────────── */
const _openPanels = new Set(); // ids of currently expanded panels
let _wikiPanelEl = null; // singleton wiki-term panel element

/* ── Config set by initDisclose() ──────────────────────────── */
let _cfg = {
  /** Container element in which to mount disclosure roots. */
  containerId: null,
  /**
   * Map of wiki term keys to definition strings.
   * { [key]: string }
   */
  wikiTerms: {},
  /** GSAP reference — optional */
  gsap: null,
};

function initDisclose(cfg) {
  Object.assign(_cfg, cfg);
  _ensureWikiPanel();
}

/* ── Public API ─────────────────────────────────────────────── */

/**
 * Validate a node against the required schema.
 * Returns { valid: bool, missing: string[] }.
 */
function validateNode(node) {
  const missing = [];
  if (!node || typeof node !== "object")
    return { valid: false, missing: ["node"] };
  if (!node.sentence) missing.push("sentence");
  if (!node.paragraph) missing.push("paragraph");
  return { valid: missing.length === 0, missing };
}

/**
 * Render a disclosure node into the given container element.
 * @param {object} node  — { sentence, paragraph, deep }
 * @param {Element} container
 * @param {string}  [id]  — unique id for state tracking
 */
function renderNode(node, container, id) {
  const { valid, missing } = validateNode(node);
  if (!valid) {
    console.error("[disclose] invalid node — missing: " + missing.join(", "));
    return;
  }
  const nodeId = id || "dn-" + Math.random().toString(36).slice(2);

  const root = document.createElement("div");
  root.className = "disclose-root";
  root.dataset.id = nodeId;

  /* Level 1: sentence */
  const sentenceEl = document.createElement("div");
  sentenceEl.className = "disclose-sentence";
  sentenceEl.innerHTML = _markup(node.sentence);
  sentenceEl.setAttribute("role", "button");
  sentenceEl.setAttribute("aria-expanded", "false");
  sentenceEl.addEventListener("click", () =>
    _toggleParagraph(nodeId, root, node),
  );

  /* Level 2: paragraph (hidden initially) */
  const paraEl = document.createElement("div");
  paraEl.className = "disclose-paragraph disclose-hidden";
  paraEl.innerHTML = _markup(node.paragraph);

  /* Level 3: SPECS button (shown when paragraph is open and deep exists) */
  let specsBtn = null;
  if (node.deep && (node.deep.specs?.length || node.deep.cited?.length)) {
    specsBtn = document.createElement("button");
    specsBtn.className = "disclose-specs-btn disclose-hidden";
    specsBtn.textContent = "SPECS ›";
    specsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      _openSpecs(node, nodeId);
    });
    paraEl.appendChild(specsBtn);
  }

  root.appendChild(sentenceEl);
  root.appendChild(paraEl);
  container.appendChild(root);
}

/**
 * Render an array of nodes into a container, one per child div.
 */
function renderNodes(nodes, container) {
  nodes.forEach((node, i) => renderNode(node, container, "dn-" + i));
}

/* ── Level 2: paragraph toggle ──────────────────────────────── */

function _toggleParagraph(nodeId, root, node) {
  const paraEl = root.querySelector(".disclose-paragraph");
  const sentenceEl = root.querySelector(".disclose-sentence");
  const specsBtn = root.querySelector(".disclose-specs-btn");
  const isOpen = _openPanels.has(nodeId);

  if (isOpen) {
    _openPanels.delete(nodeId);
    paraEl.classList.add("disclose-hidden");
    if (specsBtn) specsBtn.classList.add("disclose-hidden");
    sentenceEl.setAttribute("aria-expanded", "false");
  } else {
    _openPanels.add(nodeId);
    paraEl.classList.remove("disclose-hidden");
    if (specsBtn) specsBtn.classList.remove("disclose-hidden");
    sentenceEl.setAttribute("aria-expanded", "true");
    if (_cfg.gsap) {
      _cfg.gsap.fromTo(
        paraEl,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
      );
    }
  }
}

/* ── Level 3: SPECS overlay ─────────────────────────────────── */

function _openSpecs(node, nodeId) {
  let overlay = document.getElementById("_discloseSpecsOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "_discloseSpecsOverlay";
    overlay.className = "disclose-specs-overlay";
    document.body.appendChild(overlay);
  }

  const specs = node.deep?.specs || [];
  const cited = node.deep?.cited || [];

  overlay.innerHTML = `
    <div class="disclose-specs-inner">
      <button class="disclose-close" aria-label="Close specs">✕</button>
      <div class="disclose-specs-list">
        ${specs.map((s) => `<div class="disclose-spec-row">${_markup(s)}</div>`).join("")}
      </div>
      ${
        cited.length
          ? `
      <div class="disclose-rabbit-btn-row">
        <button class="disclose-rabbit-btn">RABBIT HOLE ›</button>
      </div>
      <div class="disclose-cited disclose-hidden">
        ${cited.map((c) => `<div class="disclose-cited-row">${_markup(c)}</div>`).join("")}
      </div>`
          : ""
      }
    </div>`;

  overlay.classList.add("active");

  overlay.querySelector(".disclose-close").addEventListener("click", () => {
    overlay.classList.remove("active");
  });

  const rabbitBtn = overlay.querySelector(".disclose-rabbit-btn");
  if (rabbitBtn) {
    rabbitBtn.addEventListener("click", () => {
      const cited = overlay.querySelector(".disclose-cited");
      if (cited) cited.classList.toggle("disclose-hidden");
    });
  }

  if (_cfg.gsap) {
    _cfg.gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  }
}

/* ── Wiki-term panel ─────────────────────────────────────────── */

function _ensureWikiPanel() {
  if (_wikiPanelEl) return;
  _wikiPanelEl = document.createElement("div");
  _wikiPanelEl.id = "_discloseWikiPanel";
  _wikiPanelEl.className = "disclose-wiki-panel disclose-hidden";
  document.body.appendChild(_wikiPanelEl);
}

function _showWikiTerm(key, anchorEl) {
  if (!_wikiPanelEl) return;
  const def = (_cfg.wikiTerms && _cfg.wikiTerms[key]) || "";
  if (!def) return;
  _wikiPanelEl.innerHTML = `<strong>${key}</strong><br>${_markup(def)}`;
  _wikiPanelEl.classList.remove("disclose-hidden");
  const r = anchorEl.getBoundingClientRect();
  _wikiPanelEl.style.left = r.left + "px";
  _wikiPanelEl.style.top = r.bottom + 8 + "px";
}

function _hideWikiTerm() {
  if (_wikiPanelEl) _wikiPanelEl.classList.add("disclose-hidden");
}

/* ── Markup processor ────────────────────────────────────────── */

/**
 * Apply inline markup rules to a string:
 *   [[key|display]] → wiki-term span
 *   *word*          → <strong>word</strong>
 */
function _markup(text) {
  if (!text) return "";
  return text
    .replace(
      /\[\[([^\]|]+)\|([^\]]+)\]\]/g,
      (_, key, display) =>
        `<span class="disclose-wikiterm" data-key="${_esc(key)}"
             onmouseenter="_discloseWikiShow(this,'${_esc(key)}')"
             onmouseleave="_discloseWikiHide()">${_esc(display)}</span>`,
    )
    .replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
}

function _esc(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

/* Expose wiki handlers for inline onmouseenter attributes */
if (typeof window !== "undefined") {
  window._discloseWikiShow = _showWikiTerm;
  window._discloseWikiHide = _hideWikiTerm;
}

export { initDisclose, validateNode, renderNode, renderNodes };

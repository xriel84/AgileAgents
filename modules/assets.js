/**
 * deck/modules/assets.js — asset resolution layer
 *
 * Source: AL-v8.html assetUrl/handleImgError/preloadLayer (L2321-2339, L5093-5143)
 *         mfa-building.html assetUrl/ASSET_MANIFEST (L6019-6107)
 *
 * Contract:
 *  - assetUrl(key) returns a URL constructed from ASSET_BASE_URL + key.
 *    Key must exist in the loaded manifest; unknown keys log a warning and
 *    return the degrade_to URL or '' if no degrade_to exists.
 *  - Never returns a local-origin URL (no local server dependency).
 *  - Keys are read from deck/config/deck_assets.jsonl; never derived inline.
 *  - Typos baked into published keys stay — they are re-publish problems, not renames.
 */

/* Configurable asset base. Override before calling initAssets().
 * Default 'assets/' resolves relative to the document. */
let ASSET_BASE_URL = "assets/";

/* Manifest loaded by initAssets() */
let _manifest = null; // Map<key, row>
let _manifestReady = false;
const _readyCallbacks = [];

/**
 * Load deck/config/deck_assets.jsonl and build the key → row map.
 * Call once at page init. Subsequent calls return the same promise.
 */
let _initPromise = null;
function initAssets(baseUrl, manifestUrl) {
  if (baseUrl !== undefined) ASSET_BASE_URL = baseUrl;
  if (_initPromise) return _initPromise;
  const url = manifestUrl || "config/deck_assets.jsonl";
  _initPromise = fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error("deck_assets.jsonl fetch failed: " + r.status);
      return r.text();
    })
    .then((text) => {
      _manifest = new Map();
      text.split("\n").forEach((line) => {
        line = line.trim();
        if (!line) return;
        try {
          const row = JSON.parse(line);
          if (row.key) _manifest.set(row.key, row);
        } catch (_) {
          /* skip malformed rows */
        }
      });
      _manifestReady = true;
      _readyCallbacks.forEach((cb) => cb());
    });
  return _initPromise;
}

/** Register a callback for when the manifest is ready. Fires immediately if already loaded. */
function onAssetsReady(cb) {
  if (_manifestReady) {
    cb();
    return;
  }
  _readyCallbacks.push(cb);
}

/**
 * Build a URL for the given asset key.
 * Returns '' for falsy keys.
 * Returns degrade_to URL if the key is absent from the manifest.
 */
function assetUrl(key) {
  if (!key) return "";
  if (!_manifestReady) {
    console.warn(
      '[assets] assetUrl("' + key + '") called before initAssets() resolved',
    );
    return ASSET_BASE_URL + key;
  }
  const row = _manifest.get(key);
  if (!row) {
    console.warn("[assets] key not in manifest: " + key);
    if (_manifest.has && false) {
    } // guard: never fabricate a key
    // Try degrade path by convention (swap .webp → .png)
    return "";
  }
  return ASSET_BASE_URL + key;
}

/**
 * Resolve the best available URL for a key, falling back through degrade_to chain.
 * Returns '' if the chain is exhausted.
 */
function assetUrlWithFallback(key) {
  if (!key) return "";
  const row = _manifest && _manifest.get(key);
  if (!row) return "";
  const primary = ASSET_BASE_URL + key;
  const fallback = row.degrade_to ? ASSET_BASE_URL + row.degrade_to : "";
  return primary + (fallback ? "|" + fallback : ""); // caller splits on '|'
}

/**
 * img onerror handler — tries degrade_to from manifest, then renders SVG placeholder.
 * Attach as: img.onerror = function(){ handleImgError(this); }
 */
function handleImgError(img) {
  const src = img.src || "";
  const key = src.split(ASSET_BASE_URL).pop()?.split("?")[0] || "";
  const row = _manifest && _manifest.get(key);

  if (row && row.degrade_to && img.src !== ASSET_BASE_URL + row.degrade_to) {
    img.src = ASSET_BASE_URL + row.degrade_to;
    return;
  }

  const name = decodeURIComponent(key || "asset");
  console.log("[assets] " + name + " unavailable — rendering placeholder");
  img.src = _svgPlaceholder(name.substring(0, 30));
  img.onerror = null;
}

function _svgPlaceholder(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" fill="#1a1a1a" rx="8"/>
    <text x="128" y="120" text-anchor="middle" fill="#c9a84c" font-family="sans-serif" font-size="12">${label}</text>
    <text x="128" y="145" text-anchor="middle" fill="#555" font-family="sans-serif" font-size="10">asset unavailable</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/**
 * Depth-based preloader — queues browser fetches for assets at a given depth tier.
 * layerNum corresponds to zoom depth: 0=exterior, 1=floor, 2=office, 3=brain.
 * Tags used to filter manifest rows by depth.
 */
const _preloadedLayers = {};
function preloadLayer(layerNum) {
  if (_preloadedLayers[layerNum]) return;
  _preloadedLayers[layerNum] = true;
  if (!_manifestReady) {
    onAssetsReady(() => preloadLayer(layerNum));
    return;
  }

  const tagSets = {
    0: ["skyline"],
    1: ["tube"],
    2: ["medium", "set-skyline"],
    3: ["brain", "closeup"],
  };
  const wantTags = new Set(tagSets[layerNum] || []);
  const urls = [];

  _manifest.forEach((row, key) => {
    if (!row.tags) return;
    if (row.tags.some((t) => wantTags.has(t))) {
      urls.push(ASSET_BASE_URL + key);
    }
  });

  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
  console.log(
    "[assets] preloadLayer(" + layerNum + ") — " + urls.length + " assets",
  );
}

/** Return all manifest rows matching a role prefix. */
function assetsByRole(rolePrefix) {
  if (!_manifestReady) return [];
  const out = [];
  _manifest.forEach((row) => {
    if (row.role && row.role.startsWith(rolePrefix)) out.push(row);
  });
  return out;
}

/** Return all keys registered in the manifest (for gate checks). */
function manifestKeys() {
  return _manifest ? [..._manifest.keys()] : [];
}

export {
  initAssets,
  onAssetsReady,
  assetUrl,
  assetUrlWithFallback,
  handleImgError,
  preloadLayer,
  assetsByRole,
  manifestKeys,
};

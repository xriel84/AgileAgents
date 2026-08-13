// FIXTURE: asset-resolves (missing key) — must FAIL the gate
// Rule: every asset reference key must exist in deck/config/deck_assets.jsonl.
// This file references a key that is not in the manifest.
const url = assetUrl("this_key_does_not_exist_in_manifest_00001.webp");

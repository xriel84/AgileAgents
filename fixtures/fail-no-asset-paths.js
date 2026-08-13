// RED fixture for no-asset-paths gate.
// This file intentionally contains a literal asset path and a localhost URL.
// deck_verify.py must report passed=False for this file.

const bg = "/frontend/assets/sets/skyline/al_skyline_W-C_back_00001.png";
const api = "http://localhost:8000/api/agent-status";

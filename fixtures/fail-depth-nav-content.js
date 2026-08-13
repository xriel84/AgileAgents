// FIXTURE: depth-nav-content-free — must FAIL the gate
// Rule: depth-nav.js must contain zero content strings.
// This file contains content strings that would violate the rule.

function drillToFloor(floorId) {
  // VIOLATION: hardcoded content strings
  document.getElementById("back-btn").textContent = "← Building";
  document.getElementById("floor-title").textContent = "PRODUCTION FLOOR";
  showLabel("Ari Tarr — CEO / Creative Director");
}

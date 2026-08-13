// This fixture deliberately violates the no-content-in-modules gate.
// It contains display label strings from the content spec that must
// only appear in deck/content/nodes.json, never in deck/modules/*.

function initAgents() {
  const agents = ["AriBot", "TABot", "StreamBot", "XRBot"];
  return agents;
}

/**
 * Deterministic Incident Graph Validator for Incident Commander Adventure
 * Ensures every non-terminal branching node in the incident response tree has valid target nodes.
 */

export function validateIncidentDecisionGraph(nodes = {}) {
  const ids = Object.keys(nodes);
  const brokenEdges = [];
  let terminalCount = 0;

  for (const [nodeId, node] of Object.entries(nodes)) {
    const choices = Array.isArray(node.choices) ? node.choices : [];
    if (choices.length === 0) {
      terminalCount += 1;
    }
    for (const c of choices) {
      if (!nodes[c.next]) {
        brokenEdges.push({ from: nodeId, missingTarget: c.next });
      }
    }
  }

  return {
    totalNodes: ids.length,
    terminalNodes: terminalCount,
    brokenEdgesCount: brokenEdges.length,
    validGraph: ids.length > 0 && brokenEdges.length === 0
  };
}

import test from "node:test";
import assert from "node:assert/strict";
import { validateIncidentDecisionGraph } from "../src/graph-validator.mjs";

test("Incident decision graph validator detects reachable and terminal endings", () => {
  const sampleGraph = {
    start: {
      title: "Root Alert",
      choices: [
        { label: "Inspect DB", next: "db_node" },
        { label: "Rollback", next: "resolved" }
      ]
    },
    db_node: {
      title: "Connection Pool Exhausted",
      choices: [{ label: "Drain pool", next: "resolved" }]
    },
    resolved: {
      title: "Incident Mitigated",
      choices: []
    }
  };
  const check = validateIncidentDecisionGraph(sampleGraph);
  assert.equal(check.validGraph, true);
  assert.equal(check.totalNodes, 3);
  assert.equal(check.terminalNodes, 1);
});

#!/usr/bin/env node
/**
 * GitHub Copilot Choose-Your-Own-Adventure CLI & Web App
 * MLH Global Hack Week: Builders Week
 * Challenges:
 *  - Use GitHub Copilot to Build a Simple Application
 *  - Use GitHub Copilot to complete any of this week's challenges
 */
import http from "node:http";

export const STORY_NODES = {
  start: {
    id: "start",
    title: "02:14 UTC: PagerDuty Alert on Cluster ap-south-1",
    narrative: "Latency on the primary checkout API just jumped from 18ms to 1,420ms during a flash sale. You open GitHub Copilot in your terminal to triage.",
    choices: [
      { label: "Inspect PostgreSQL pg_stat_activity and active locks", next: "db_locks" },
      { label: "Check Redis rate-limiter and connection pool saturation", next: "redis_pool" }
    ]
  },
  db_locks: {
    id: "db_locks",
    title: "02:16 UTC: Unindexed Seq Scan Detected",
    narrative: "Copilot generates a diagnostic query revealing 480 concurrent workers blocked on a sequential scan of order_events. You convert order_events into a partitioned hypertable and add a composite index on (merchant_id, created_at DESC).",
    choices: [
      { label: "Deploy concurrent index migration and verify p99 latency", next: "resolved" }
    ]
  },
  redis_pool: {
    id: "redis_pool",
    title: "02:16 UTC: Redis Atomic Lua Script Optimization",
    narrative: "Copilot spots a round-trip N+1 token bucket check in the API gateway and refactors it into a single atomic EVALSHA Lua script.",
    choices: [
      { label: "Roll out atomic Lua script and check p99 latency", next: "resolved" }
    ]
  },
  resolved: {
    id: "resolved",
    title: "02:19 UTC: Incident Resolved (p99 Latency: 11.4ms)",
    narrative: "Checkout p99 drops from 1,420ms to 11.4ms with zero dropped orders. Postmortem and regression test suite committed.",
    choices: []
  }
};

export function simulateAdventurePath() {
  return [STORY_NODES.start, STORY_NODES.db_locks, STORY_NODES.resolved];
}

if (process.argv.includes("--cli")) {
  console.log("=== GitHub Copilot Choose-Your-Own-Adventure: Incident Commander ===");
  for (const step of simulateAdventurePath()) {
    console.log(`\n[${step.title}]\n${step.narrative}`);
    if (step.choices.length > 0) {
      console.log(`  -> Selected: ${step.choices[0].label}`);
    }
  }
  process.exit(0);
}

export function requestHandler(req, res) {
  const path = simulateAdventurePath();
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GitHub Copilot Build: Incident Commander Adventure & Portfolio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; background: #0d1117; color: #e6edf3; padding: 28px; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #30363d; padding-bottom: 16px; margin-bottom: 22px; }
    .badge { background: #238636; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .step { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px; margin-bottom: 14px; }
    .step h2 { font-size: 16px; color: #58a6ff; margin-bottom: 6px; font-family: monospace; }
    .step p { font-size: 14px; color: #c9d1d9; line-height: 1.5; }
    .choice { margin-top: 10px; display: inline-block; background: #1f242c; border: 1px solid #388bfd; color: #79c0ff; padding: 6px 12px; border-radius: 6px; font-size: 12.5px; font-family: monospace; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1 style="font-size:21px;display:flex;align-items:center;gap:10px;">
        <span class="badge">GITHUB COPILOT</span>
        Choose Your Own Adventure: Production Incident Commander
      </h1>
      <p style="font-size:13px;color:#8b949e;margin-top:4px;">
        Built with GitHub Copilot for MLH Global Hack Week: Builders Week (@princejain756) · Live on copilot-adventure.prince.sh
      </p>
    </div>
    <div style="font-family:monospace;font-size:12px;color:#3fb950;border:1px solid #238636;padding:6px 12px;border-radius:6px;">
      ● CLI + WEB APP ACTIVE
    </div>
  </header>
  ${path.map(s => `
    <div class="step">
      <h2>${s.title}</h2>
      <p>${s.narrative}</p>
      ${s.choices[0] ? `<div class="choice">Selected Action &rarr; ${s.choices[0].label}</div>` : `<div class="choice" style="border-color:#238636;color:#3fb950;">✓ Incident Resolved (p99: 11.4ms)</div>`}
    </div>
  `).join("")}
</body>
</html>`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = Number(process.env.PORT || 4579);
  http.createServer(requestHandler).listen(PORT, () => {
    console.log(`Copilot Adventure running at http://localhost:${PORT}`);
  });
}

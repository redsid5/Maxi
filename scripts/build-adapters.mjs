#!/usr/bin/env node
// Generates every platform adapter from the single source of truth: MAXI.md
// Run: node scripts/build-adapters.mjs
// Adapters are committed so users can copy them straight from GitHub,
// but they must never be edited by hand — edit MAXI.md and rebuild.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const spec = readFileSync(join(root, "MAXI.md"), "utf8");

// Compact variant for platforms with instruction-length caps (ChatGPT GPTs: 8000 chars).
// Drops the reference-example section; behavior is fully specified by sections 1–5.
const compact = spec.split(/\n---\n\n## 6\. Reference example/)[0].trim() + "\n";

const banner = (platform) =>
  `<!-- Generated from MAXI.md by scripts/build-adapters.mjs for ${platform}. Do not edit by hand. -->\n\n`;

const out = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel, `(${content.length} chars)`);
};

// Claude Code / Claude Cowork skill
out(
  "adapters/claude-code/maxi/SKILL.md",
  `---
name: maxi
description: Prompt compiler. Use when the user types /maxi followed by a rough request, or asks to optimize, strengthen, or rewrite a prompt for any AI system. Turns vague intent into the strongest executable prompt — not a longer one.
---

${spec}`
);

// Cursor rule (.cursor/rules/maxi.mdc)
out(
  "adapters/cursor/maxi.mdc",
  `---
description: MAXI prompt compiler. Apply when the user writes /maxi or asks to optimize a prompt.
globs:
alwaysApply: false
---

${spec}`
);

// Windsurf rule (.windsurf/rules/maxi.md)
out(
  "adapters/windsurf/maxi.md",
  `---
trigger: model_decision
description: MAXI prompt compiler. Apply when the user writes /maxi or asks to optimize a prompt.
---

${spec}`
);

// GitHub Copilot prompt file (.github/prompts/maxi.prompt.md) — invoked as /maxi in VS Code chat
out(
  "adapters/copilot/maxi.prompt.md",
  `---
mode: ask
description: Compile a rough request into the strongest executable prompt.
---

${spec}

---

The user's request follows. Compile it.
`
);

// ChatGPT custom GPT — 8000 char cap on instructions
out("adapters/chatgpt/instructions.md", banner("ChatGPT custom GPT (compact, under 8000 chars)") + compact);

// Claude Project instructions
out("adapters/claude-project/instructions.md", banner("Claude Project custom instructions") + spec);

// Gemini Gem instructions
out("adapters/gemini/gem-instructions.md", banner("Gemini Gem instructions") + spec);

// Generic system prompt
out("adapters/generic/system-prompt.md", banner("any model that accepts a system prompt") + spec);

// Plain-text copies for API use
out("adapters/api/system-prompt.txt", spec);
out("adapters/api/system-prompt.compact.txt", compact);

if (compact.length > 8000) {
  console.error(`WARNING: compact spec is ${compact.length} chars; ChatGPT GPT cap is 8000.`);
  process.exit(1);
}

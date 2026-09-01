#!/usr/bin/env node
import { readFileSync, existsSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { resolveProvider, KNOWN_PROVIDERS } from "./providers.mjs";

const here = dirname(fileURLToPath(import.meta.url));

function loadSpec() {
  // Packaged copy (npm) first, then monorepo root (git clone).
  for (const p of [join(here, "..", "MAXI.md"), join(here, "..", "..", "MAXI.md")]) {
    if (existsSync(p)) return readFileSync(p, "utf8");
  }
  throw new Error("MAXI.md not found next to the CLI.");
}

const HELP = `maxi — prompt compiler. Tell it what you want; it figures out how to ask AI for it.

Usage
  maxi [quick|max] <request...>       compile a request (default mode: auto)
  echo "request" | maxi [quick|max]   read the request from stdin
  maxi --version | --help

Options
  -t, --target <name>     shape for a target: chatgpt, claude, gemini, claude-code, cursor,
                          copilot, midjourney, dalle, stable-diffusion, research, image, coding
  -p, --provider <name>   ${KNOWN_PROVIDERS.join(", ")}, or any OpenAI-compatible server
  -m, --model <id>        model id (provider default if omitted)
      --base-url <url>    endpoint for OpenAI-compatible servers (e.g. http://localhost:11434/v1)
      --api-key <key>     override the provider's env var
  -r, --raw               print only the compiled prompt (no assumptions/notes) — good for piping
  -c, --copy              copy the compiled prompt to the clipboard
      --spec              print the MAXI spec and exit

Environment
  MAXI_PROVIDER, MAXI_MODEL, MAXI_BASE_URL, MAXI_API_KEY
  OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, GROQ_API_KEY
  Provider is auto-detected from whichever key is set; falls back to local Ollama.

Examples
  maxi I want to make an app for students to network
  maxi quick summarize this contract for a non-lawyer
  maxi max --target claude-code add rate limiting to our Express API
  maxi -t midjourney a cozy cabin in a snowstorm --copy
  cat notes.txt | maxi --raw > prompt.txt
`;

function parseArgs(argv) {
  const o = { mode: "auto", words: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "-h" || a === "--help") o.help = true;
    else if (a === "-v" || a === "--version") o.version = true;
    else if (a === "--spec") o.spec = true;
    else if (a === "-r" || a === "--raw") o.raw = true;
    else if (a === "-c" || a === "--copy") o.copy = true;
    else if (a === "-t" || a === "--target") o.target = next();
    else if (a === "-p" || a === "--provider") o.provider = next();
    else if (a === "-m" || a === "--model") o.model = next();
    else if (a === "--base-url") o.baseUrl = next();
    else if (a === "--api-key") o.apiKey = next();
    else if (a.startsWith("--target=")) o.target = a.slice(9);
    else if (a.startsWith("--provider=")) o.provider = a.slice(11);
    else if (a.startsWith("--model=")) o.model = a.slice(8);
    else if (o.words.length === 0 && (a === "quick" || a === "max")) o.mode = a;
    else o.words.push(a);
  }
  return o;
}

async function readStdin() {
  if (process.stdin.isTTY) return "";
  let s = "";
  for await (const chunk of process.stdin) s += chunk;
  return s.trim();
}

export function extractPrompt(output) {
  // First fenced block is the compiled prompt per the output contract.
  const m = output.match(/```[a-z]*\n([\s\S]*?)\n```/);
  return m ? m[1].trim() : output.trim();
}

function copyToClipboard(text) {
  const candidates =
    process.platform === "darwin"
      ? [["pbcopy"]]
      : process.platform === "win32"
      ? [["clip"]]
      : [["wl-copy"], ["xclip", "-selection", "clipboard"], ["xsel", "--clipboard", "--input"]];
  for (const [cmd, ...args] of candidates) {
    const r = spawnSync(cmd, args, { input: text, stdio: ["pipe", "ignore", "ignore"] });
    if (r.status === 0) return true;
  }
  return false;
}

export function buildUserMessage({ mode, target, request }) {
  const prefix = mode === "auto" ? "/maxi" : `/maxi ${mode}`;
  const hint = target ? ` for ${target}` : "";
  return `${prefix} ${request}${hint}`;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return process.stdout.write(HELP);
  if (opts.version) {
    const pkg = JSON.parse(readFileSync(join(here, "..", "package.json"), "utf8"));
    return console.log(pkg.version);
  }
  const spec = loadSpec();
  if (opts.spec) return process.stdout.write(spec);

  let request = opts.words.join(" ").trim();
  const piped = await readStdin();
  if (piped) request = request ? `${request}\n\n${piped}` : piped;
  if (!request) {
    process.stderr.write(HELP);
    process.exit(2);
  }

  const { provider, model, apiKey, baseUrl, complete } = resolveProvider(opts);
  process.stderr.write(`\x1b[2mmaxi · ${opts.mode} · ${provider}/${model}\x1b[0m\n`);

  const output = await complete({
    system: spec,
    user: buildUserMessage({ mode: opts.mode, target: opts.target, request }),
    model,
    apiKey,
    baseUrl,
  });

  const prompt = extractPrompt(output);
  process.stdout.write((opts.raw ? prompt : output.trim()) + "\n");

  if (opts.copy) {
    process.stderr.write(copyToClipboard(prompt) ? "\x1b[2mcopied to clipboard\x1b[0m\n" : "\x1b[33mclipboard unavailable\x1b[0m\n");
  }
}

const invokedDirectly = (() => {
  try {
    return process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (invokedDirectly) {
  main().catch((e) => {
    process.stderr.write(`\x1b[31merror:\x1b[0m ${e.message}\n`);
    process.exit(1);
  });
}

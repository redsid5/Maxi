// Offline test: spins up a fake OpenAI-compatible server, runs the CLI against it,
// and checks argument parsing, the system prompt, the user message, and --raw extraction.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { strict as assert } from "node:assert";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "src", "cli.mjs");

let lastBody = null;
const FAKE_REPLY = "```\nAct as a test.\nDo the thing.\n```\n\nCompiled in auto mode for a general chat model.\n";

const server = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    lastBody = JSON.parse(raw);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ choices: [{ message: { content: FAKE_REPLY } }] }));
  });
});

await new Promise((r) => server.listen(0, r));
const baseUrl = `http://127.0.0.1:${server.address().port}/v1`;

function run(args, input, envOverride) {
  // Must be async: a sync spawn would block this process's event loop and the fake server could never answer.
  return new Promise((resolve) => {
    const env = envOverride ?? {
      ...process.env, MAXI_PROVIDER: "openai", MAXI_API_KEY: "test", MAXI_BASE_URL: baseUrl, MAXI_MODEL: "fake",
    };
    const p = spawn(process.execPath, [cli, ...args], { env });
    let stdout = "", stderr = "";
    p.stdout.on("data", (c) => (stdout += c));
    p.stderr.on("data", (c) => (stderr += c));
    p.on("close", (status) => resolve({ status, stdout, stderr }));
    if (input) p.stdin.write(input);
    p.stdin.end();
  });
}

let passed = 0;
const t = async (name, fn) => {
  await fn();
  passed++;
  console.log("ok -", name);
};

await t("help exits 0", async () => assert.equal((await run(["--help"])).status, 0));
await t("no args prints help and exits 2", async () => assert.equal((await run([])).status, 2));
await t("--spec prints the spec", async () => assert.match((await run(["--spec"])).stdout, /^# MAXI — Prompt Compiler Specification/));

await t("auto mode sends /maxi <request> with the spec as system", async () => {
  const r = await run(["build", "a", "todo", "app"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(lastBody.model, "fake");
  assert.equal(lastBody.messages[0].role, "system");
  assert.match(lastBody.messages[0].content, /Prompt Compiler Specification/);
  assert.equal(lastBody.messages[1].content, "/maxi build a todo app");
  assert.match(r.stdout, /Compiled in auto mode/);
});

await t("quick mode + target hint", async () => {
  await run(["quick", "-t", "claude-code", "add", "tests"]);
  assert.equal(lastBody.messages[1].content, "/maxi quick add tests for claude-code");
});

await t("max mode via positional", async () => {
  await run(["max", "plan", "a", "launch"]);
  assert.equal(lastBody.messages[1].content, "/maxi max plan a launch");
});

await t("'quick' inside the request is not treated as a mode", async () => {
  await run(["make", "it", "quick"]);
  assert.equal(lastBody.messages[1].content, "/maxi make it quick");
});

await t("stdin is appended to the request", async () => {
  await run(["summarize"], "some pasted text");
  assert.equal(lastBody.messages[1].content, "/maxi summarize\n\nsome pasted text");
});

await t("--raw prints only the fenced prompt", async () => {
  const r = await run(["--raw", "anything"]);
  assert.equal(r.stdout, "Act as a test.\nDo the thing.\n");
});

await t("missing api key errors clearly", async () => {
  const r = await run(["hi"], "", { PATH: process.env.PATH, MAXI_PROVIDER: "anthropic" });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /No API key for provider "anthropic"/);
});

server.close();
console.log(`\n${passed} tests passed`);

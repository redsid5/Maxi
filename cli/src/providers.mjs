// Provider adapters. Each exports complete({ system, user, model, apiKey, baseUrl }) -> string.
// Zero dependencies: Node 18+ global fetch.

const DEFAULT_MODELS = {
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-5",
  gemini: "gemini-2.5-pro",
  ollama: "llama3.1",
  openrouter: "anthropic/claude-sonnet-4-5",
  groq: "llama-3.3-70b-versatile",
};

const OPENAI_COMPATIBLE_BASE = {
  openai: "https://api.openai.com/v1",
  ollama: "http://localhost:11434/v1",
  openrouter: "https://openrouter.ai/api/v1",
  groq: "https://api.groq.com/openai/v1",
};

async function post(url, headers, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} from ${url}\n${text.slice(0, 500)}`);
  }
  return res.json();
}

async function openaiCompatible({ system, user, model, apiKey, baseUrl }) {
  const data = await post(
    `${baseUrl.replace(/\/$/, "")}/chat/completions`,
    { authorization: `Bearer ${apiKey || "none"}` },
    {
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }
  );
  return data.choices?.[0]?.message?.content ?? "";
}

async function anthropic({ system, user, model, apiKey, baseUrl }) {
  const data = await post(
    `${(baseUrl || "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`,
    { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    { model, max_tokens: 2048, system, messages: [{ role: "user", content: user }] }
  );
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
}

async function gemini({ system, user, model, apiKey, baseUrl }) {
  const base = (baseUrl || "https://generativelanguage.googleapis.com").replace(/\/$/, "");
  const data = await post(
    `${base}/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {},
    {
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
    }
  );
  return (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
}

export function resolveProvider(opts, env = process.env) {
  let provider = opts.provider || env.MAXI_PROVIDER;
  if (!provider) {
    if (env.ANTHROPIC_API_KEY) provider = "anthropic";
    else if (env.OPENAI_API_KEY) provider = "openai";
    else if (env.GEMINI_API_KEY || env.GOOGLE_API_KEY) provider = "gemini";
    else if (env.OPENROUTER_API_KEY) provider = "openrouter";
    else if (env.GROQ_API_KEY) provider = "groq";
    else provider = "ollama";
  }
  provider = provider.toLowerCase();

  const keyByProvider = {
    openai: env.OPENAI_API_KEY,
    anthropic: env.ANTHROPIC_API_KEY,
    gemini: env.GEMINI_API_KEY || env.GOOGLE_API_KEY,
    ollama: "ollama",
    openrouter: env.OPENROUTER_API_KEY,
    groq: env.GROQ_API_KEY,
  };
  const apiKey = opts.apiKey || env.MAXI_API_KEY || keyByProvider[provider];
  const model = opts.model || env.MAXI_MODEL || DEFAULT_MODELS[provider];
  const baseUrl = opts.baseUrl || env.MAXI_BASE_URL || OPENAI_COMPATIBLE_BASE[provider];

  let complete;
  if (provider === "anthropic") complete = anthropic;
  else if (provider === "gemini") complete = gemini;
  else complete = openaiCompatible; // openai, ollama, openrouter, groq, or anything OpenAI-compatible

  if (!apiKey && provider !== "ollama") {
    throw new Error(
      `No API key for provider "${provider}". Set ${provider.toUpperCase()}_API_KEY, or MAXI_API_KEY, or use --provider ollama.`
    );
  }
  if (!model) throw new Error(`No model for provider "${provider}". Pass --model.`);
  if (!baseUrl && complete === openaiCompatible)
    throw new Error(`Provider "${provider}" needs --base-url (OpenAI-compatible endpoint).`);

  return { provider, model, apiKey, baseUrl, complete };
}

export const KNOWN_PROVIDERS = Object.keys(DEFAULT_MODELS);

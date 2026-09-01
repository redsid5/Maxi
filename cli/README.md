# maxi-cli

Command-line front end for [MAXI](https://github.com/redsid5/maxi), the prompt compiler. Tell it what you want; it figures out how to ask AI for it.

```
npx maxi-cli I want to make an app for students to network
```

Zero dependencies. Node 18+. Bring your own API key.

## Install

```
npm i -g maxi-cli        # then just: maxi ...
```

## Providers

Set one key and `maxi` picks the provider automatically:

| Env var | Provider | Default model |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic | `claude-sonnet-4-5` |
| `OPENAI_API_KEY` | OpenAI | `gpt-4o` |
| `GEMINI_API_KEY` | Google Gemini | `gemini-2.5-pro` |
| `OPENROUTER_API_KEY` | OpenRouter | `anthropic/claude-sonnet-4-5` |
| `GROQ_API_KEY` | Groq | `llama-3.3-70b-versatile` |
| *(none)* | Ollama at `localhost:11434` | `llama3.1` |

Override with `--provider`, `--model`, `--base-url`, or `MAXI_PROVIDER` / `MAXI_MODEL` / `MAXI_BASE_URL`. Any OpenAI-compatible server works via `--base-url`.

## Usage

```
maxi [quick|max] <request...>
```

```
maxi quick summarize this contract for a non-lawyer
maxi max --target claude-code add rate limiting to our Express API
maxi -t midjourney a cozy cabin in a snowstorm --copy
cat notes.txt | maxi --raw > prompt.txt
```

| Flag | Meaning |
|---|---|
| `quick` / `max` | Mode (default: auto). Quick is capped at 8 lines; max is the full expert brief. |
| `-t, --target` | Shape for a target: `chatgpt`, `claude`, `gemini`, `claude-code`, `cursor`, `copilot`, `midjourney`, `dalle`, `stable-diffusion`, `research`, `image`, `coding`… |
| `-r, --raw` | Print only the compiled prompt — for piping. |
| `-c, --copy` | Copy the compiled prompt to the clipboard. |
| `--spec` | Print the MAXI spec. |

## Test

```
npm test     # offline; runs against a fake server
```

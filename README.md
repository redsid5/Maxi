# MAXI

**Tell it what you want. It figures out how to ask AI for it.**

`/maxi` is a prompt compiler. You give it a rough, human request; it returns the strongest possible executable prompt — for ChatGPT, Claude, Gemini, a coding agent, an image model, or a research agent.

Human intent → structured context → optimized instructions → better AI output.

```
/maxi I want to make an app for students to network
```

becomes

```
Act as a senior startup product strategist, UX designer, and technical architect.

I want to build a networking application specifically for college students. Turn this idea into a viable MVP.

Define:
1. The specific user problem worth solving.
2. The ideal first target user segment.
3. The core value proposition.
4. The 3–5 features required for the MVP.
5. Features that should NOT be built initially.
6. The primary user journey from signup to first moment of value.
7. A recommended monetization model.
8. The simplest technical architecture for launching quickly.
9. The biggest assumptions and risks.
10. A 30-day validation and launch plan.

Prioritize speed, adoption, retention, and product-market validation over feature complexity. Challenge weak assumptions instead of agreeing with them.

Return the answer as: Problem → User → Solution → MVP → User Flow → Business Model → Tech Stack → Risks → Validation Plan → Next Actions.
```

## Why this isn't another "improve my prompt" button

Most prompt rewriters make prompts longer and call it intelligence. MAXI has one rule above all others: **every line must change the output.** If the model would do it correctly by default, the line is cut.

What it actually does with your request:

| Stage | Question it answers |
|---|---|
| Intent | What do you actually want to end up with? |
| Context | What would the best expert need that you left out? |
| Goal | The one sentence the output must satisfy |
| Role | The narrowest expert whose judgment produces the best answer |
| Task | The concrete deliverables — and what *not* to do |
| Constraints | Audience, scope, length, tone, tech, budget |
| Inputs | What you must supply, as `[placeholders]` — never invented |
| Reasoning | Where the model should push back instead of agreeing |
| Output format | The structure that makes the answer usable |
| Quality criteria | What separates great from acceptable |

And it shapes the result for the target. A coding agent gets acceptance criteria and a don't-touch list, not "act as a senior engineer." An image model gets subject / composition / style / negatives, no prose. A research agent gets a recency window and a source-quality bar.

## Three modes

```
/maxi <request>          auto   — compiles at the depth the request deserves
/maxi quick <request>    quick  — hard cap of 8 lines; role, task, key constraint, output shape
/maxi max <request>      max    — full expert-grade brief
```

Add a target hint anywhere: `/maxi ... for claude code`, `/maxi ... for midjourney`, `/maxi ... for a research agent`.

## Use it anywhere

The whole product is one file: [`MAXI.md`](MAXI.md). Everything else is an adapter that puts it where you work.

| Where you work | How to install | Then |
|---|---|---|
| **Claude Code / Cowork** | copy `adapters/claude-code/maxi/` → `~/.claude/skills/` | `/maxi …` |
| **Cursor** | copy `adapters/cursor/maxi.mdc` → `.cursor/rules/` | `/maxi …` or `@maxi` |
| **Windsurf** | copy `adapters/windsurf/maxi.md` → `.windsurf/rules/` | `/maxi …` |
| **GitHub Copilot** | copy `adapters/copilot/maxi.prompt.md` → `.github/prompts/` | `/maxi` in Copilot Chat |
| **ChatGPT** | paste `adapters/chatgpt/instructions.md` into a custom GPT | `/maxi …` |
| **Claude.ai** | paste `adapters/claude-project/instructions.md` into a Project | `/maxi …` |
| **Gemini** | paste `adapters/gemini/gem-instructions.md` into a Gem | `/maxi …` |
| **Terminal** | `npx maxi-cli …` (OpenAI, Anthropic, Gemini, Groq, OpenRouter, Ollama) | `maxi …` |
| **Your own app** | `adapters/api/` — Python + curl examples | system prompt = `MAXI.md` |
| **Anything else** | `adapters/generic/system-prompt.md` | |

Full install notes: [`adapters/README.md`](adapters/README.md). CLI docs: [`cli/README.md`](cli/README.md).

### CLI in 10 seconds

```bash
export ANTHROPIC_API_KEY=...     # or OPENAI_API_KEY, GEMINI_API_KEY, or nothing for local Ollama
npx maxi-cli quick write a cold email to a podcast host
npx maxi-cli max -t claude-code add rate limiting to our Express API --copy
```

## Examples

See [`examples/`](examples/) for the same request compiled in each mode and for several targets.

## Contributing

`MAXI.md` is the single source of truth. Adapters are generated — never edit them by hand:

```bash
node scripts/build-adapters.mjs   # regenerate every adapter from MAXI.md
cd cli && npm test                # offline CLI tests
```

Want a new platform? Add a target to `scripts/build-adapters.mjs` and a row to `adapters/README.md`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache 2.0 — see [LICENSE](LICENSE).

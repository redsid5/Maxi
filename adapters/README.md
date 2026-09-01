# Adapters

Every file here is **generated from [`../MAXI.md`](../MAXI.md)** by `node scripts/build-adapters.mjs`. Don't edit adapters by hand; edit the spec and rebuild.

| Platform | File | Install |
|---|---|---|
| **Claude Code / Claude Cowork** | `claude-code/maxi/SKILL.md` | Copy the `maxi/` folder into `~/.claude/skills/` (personal) or `.claude/skills/` (project). Then type `/maxi …`. |
| **Cursor** | `cursor/maxi.mdc` | Copy to `.cursor/rules/maxi.mdc` in your project. Write `/maxi …` in chat, or `@maxi`. |
| **Windsurf** | `windsurf/maxi.md` | Copy to `.windsurf/rules/maxi.md`. |
| **GitHub Copilot (VS Code)** | `copilot/maxi.prompt.md` | Copy to `.github/prompts/maxi.prompt.md`. Type `/maxi` in Copilot Chat. |
| **ChatGPT** | `chatgpt/instructions.md` | Explore GPTs → Create → Configure → paste into *Instructions*. (Compact variant: fits the 8 000-char cap.) |
| **Claude.ai** | `claude-project/instructions.md` | New Project → *Set project instructions* → paste. |
| **Gemini** | `gemini/gem-instructions.md` | Gem manager → New Gem → paste into *Instructions*. |
| **Any model with a system prompt** | `generic/system-prompt.md` | Paste as the system prompt. |
| **OpenAI API** | `api/openai.py` | `pip install openai`, set `OPENAI_API_KEY`, run. |
| **Anthropic API** | `api/anthropic.py` | `pip install anthropic`, set `ANTHROPIC_API_KEY`, run. |
| **curl / Ollama / any OpenAI-compatible server** | `api/curl.sh` | Set `OPENAI_BASE_URL` to your server (e.g. `http://localhost:11434/v1` for Ollama). |

Missing your platform? The generic system prompt works almost everywhere. Open a PR adding a target to `scripts/build-adapters.mjs`.

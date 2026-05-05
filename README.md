<div align="center">

# skills

A curated collection of AI coding agent skills for [skills.sh](https://skills.sh)

[![skills.sh](https://img.shields.io/badge/skills.sh-browse-black?style=for-the-badge)](https://skills.sh)

---

</div>

## Available Skills

| Skill | Description |
|-------|-------------|
| [branded-types](skills/branded-types/SKILL.md) | Implement branded (nominal/opaque) types in TypeScript to prevent accidental mixing of structurally identical types like `UserId` and `PostId`. Zero runtime overhead. |
| [generate-dockerfile-iaskshahram](skills/generate-dockerfile-iaskshahram/SKILL.md) | Generate production-ready, secure, multi-stage `Dockerfile` and `.dockerignore` tailored to the project's language, framework, and dependencies. |
| [impeccable](skills/impeccable/SKILL.md) | Design, audit, and iterate production-grade frontend interfaces — UX review, visual hierarchy, accessibility, theming, motion, and live browser iteration. |
| [ts-rules-iaskshahram](skills/ts-rules-iaskshahram/SKILL.md) | Personal TypeScript/JS preferences — package managers (pnpm/bun), tech stack defaults, command policies, and code style rules. |
| [uncodixfy](skills/uncodixfy/SKILL.md) | Prevents generic AI/Codex UI patterns when generating frontend code. Enforces clean, human-designed aesthetics inspired by Linear, Raycast, Stripe, and GitHub. |

## Usage

### skills.sh (Recommended)

Install with the [skills CLI](https://skills.sh/docs/cli) -- no manual copying needed:

```bash
npx skills add iAskShahram/<skill-name>
# e.g.
npx skills add iAskShahram/branded-types
npx skills add iAskShahram/impeccable
```

Browse these skills on the [skills.sh leaderboard](https://skills.sh).

### Cursor

Copy the skill directory into your project and reference it in `.cursor/rules/skills.mdc`:

```markdown
| **<skill-name>** | `.cursor/skills/<skill-name>/SKILL.md` | Short description of when to use. |
```

Or attach the `SKILL.md` directly to your conversation.

### Claude Code

Copy the skill directory to `~/.claude/skills/<skill-name>/`.

## Skill Structure

Each skill follows the [Vercel agent-skills](https://github.com/vercel-labs/agent-skills) conventions:

```
skills/<name>/
  SKILL.md          # Entry point (concise, <500 lines)
  AGENTS.md         # Full compiled guide for AI agents
  CLAUDE.md         # Short directive instructions for Claude
  README.md         # Human-readable overview
  references/       # Supporting docs, patterns, integrations
```

## Adding a New Skill

1. Create a directory under `skills/<skill-name>/`
2. Add a `SKILL.md` as the entry point -- concise, code-heavy, written for an AI audience
3. Put detailed references in `references/`
4. Update the **Available Skills** table above

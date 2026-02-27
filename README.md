# skills

A curated collection of AI coding agent skills for [skills.sh](https://skills.sh). Each skill teaches AI assistants specialized patterns and best practices they can apply in your codebase.

## Available Skills

| Skill | Description |
|-------|-------------|
| [branded-types](skills/branded-types/SKILL.md) | Implement branded (nominal) types in TypeScript to prevent accidental mixing of structurally identical types like `UserId` and `PostId`. Zero runtime overhead. |

## Usage

### skills.sh (Recommended)

Install with the [skills CLI](https://skills.sh/docs/cli) -- no manual copying needed:

```bash
npx skills add iAskShahram/branded-types
```

Browse this skill on the [skills.sh leaderboard](https://skills.sh).

### Cursor

Copy the skill directory into your project and reference it in `.cursor/rules/skills.mdc`:

```markdown
| **branded-types** | `.cursor/skills/branded-types/SKILL.md` | Writing TypeScript code with branded/nominal types. |
```

Or attach the `SKILL.md` directly to your conversation.

### Claude Code

Copy the skill directory to `~/.claude/skills/branded-types/`.

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

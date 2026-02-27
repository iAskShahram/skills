# Branded Types Skill

An agent skill that teaches AI coding assistants how to implement **branded (nominal) types** in TypeScript — compile-time markers that prevent accidental mixing of structurally identical types like `UserId` and `PostId`.

## Quick Example

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type UserId = Brand<string, 'UserId'>
type PostId = Brand<string, 'PostId'>

function getUser(id: UserId) { /* ... */ }

const postId = createPostId("post-123")
getUser(postId) // Compile error! PostId is not assignable to UserId
```

Zero runtime overhead — brands are erased during compilation.

## Directory Structure

```
branded-types/
  SKILL.md              # Main skill entry point (<500 lines)
  AGENTS.md             # Full compiled guide for AI agents
  CLAUDE.md             # Short directive instructions for Claude
  README.md             # This file
  references/
    patterns.md         # Detailed implementation variants & trade-offs
    integrations.md     # Zod, Drizzle, Prisma integration examples
```

## What's Covered

- **3 implementation patterns** with pros/cons and a recommendation (Pattern C: generic `unique symbol`)
- **Constructor functions** — confine `as` casts to validated constructors
- **Use cases** — type-safe IDs, validated strings, unit numbers, tokens
- **Anti-patterns** — no runtime brand checks, no bare casts, no over-branding
- **Library integrations** — Zod `.brand()`, Drizzle `.$type<>()`, Prisma wrappers
- **Advanced utilities** — composing brands, `Unbrand<T>` type extractor

## Usage

**In Cursor:** Attach this skill to your conversation or add it to `.cursor/rules/skills.mdc`.

**In Claude Code:** Copy this directory to `~/.claude/skills/branded-types/`.

**Manual reference:** Read `SKILL.md` for the concise guide, or `AGENTS.md` for the full expanded document.

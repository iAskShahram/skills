# CLAUDE.md — Branded Types

## When to Apply

Use this skill when:
- Writing or reviewing TypeScript code with multiple ID types (UserId, PostId, etc.)
- Creating validated string types (Email, URL, NonEmptyString)
- Working with unit-specific numbers (Meters, Seconds, Milliseconds)
- The user mentions "branded types", "nominal types", "opaque types", or "type-safe IDs"
- Refactoring plain `string`/`number` type aliases into safer alternatives

## Default Pattern

Always use Pattern C — the generic `Brand` utility with a single `unique symbol`:

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }
```

## Key Rules

1. **Always create constructor functions** — never use bare `as` casts in application code
2. **Use descriptive brand names** — `'UserId'` not `'Id'`, `'Meters'` not `'Unit'`
3. **Don't over-brand** — only brand types where mixing would cause bugs
4. **Brands are compile-time only** — never check `__brand` at runtime
5. **Confine `as` casts to constructors** — the only place type assertions should appear

## Quick Reference

```typescript
// Define
type UserId = Brand<string, 'UserId'>

// Construct (with validation)
function createUserId(id: string): UserId {
  if (!id) throw new Error('Invalid UserId')
  return id as UserId
}

// Use
function getUser(id: UserId) { /* ... */ }
const id = createUserId("user-123")
getUser(id) // OK
```

## Full Guide

For comprehensive patterns, library integrations, and advanced utilities, see `AGENTS.md` in this directory.

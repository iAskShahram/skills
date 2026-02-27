# Branded Types in TypeScript

> **Note:**
> This document is for AI coding agents and LLMs to follow when generating,
> reviewing, or refactoring TypeScript code that uses branded (nominal/opaque) types.
> Humans may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.

---

## Abstract

Branded types add compile-time-only markers to prevent accidental mixing of structurally identical TypeScript types. This guide covers three implementation patterns, constructor functions, real-world use cases, anti-patterns, library integrations (Zod, Drizzle, Prisma), and advanced utilities like brand composition and type unwrapping. Zero runtime overhead.

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [Core Brand Utility](#2-core-brand-utility)
3. [Implementation Patterns](#3-implementation-patterns)
   - 3.1 [Pattern A: `__brand` Property](#31-pattern-a-__brand-property)
   - 3.2 [Pattern B: Per-Type `unique symbol`](#32-pattern-b-per-type-unique-symbol)
   - 3.3 [Pattern C: Generic `unique symbol` (Recommended)](#33-pattern-c-generic-unique-symbol-recommended)
   - 3.4 [Comparison Table](#34-comparison-table)
4. [Constructor Functions](#4-constructor-functions)
   - 4.1 [Manual Constructors](#41-manual-constructors)
   - 4.2 [Generic Constructor Factory](#42-generic-constructor-factory)
5. [Real-World Use Cases](#5-real-world-use-cases)
6. [Anti-Patterns](#6-anti-patterns)
7. [Library Integrations](#7-library-integrations)
   - 7.1 [Zod](#71-zod)
   - 7.2 [Drizzle ORM](#72-drizzle-orm)
   - 7.3 [Prisma](#73-prisma)
   - 7.4 [End-to-End Example](#74-end-to-end-example)
8. [Advanced Utilities](#8-advanced-utilities)
   - 8.1 [Composing Multiple Brands](#81-composing-multiple-brands)
   - 8.2 [Extracting the Base Type](#82-extracting-the-base-type)
9. [Decision Table](#9-decision-table)

---

## 1. The Problem

TypeScript uses structural typing. Two types with the same shape are interchangeable:

```typescript
type UserId = string
type PostId = string

function getUser(id: UserId) { /* ... */ }

const postId: PostId = "post-123"
getUser(postId) // No error! Both are just `string`
```

Branded types make these incompatible at compile time while adding zero runtime overhead.

---

## 2. Core Brand Utility

The recommended utility (Pattern C):

```typescript
// brand.ts
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }
```

Usage:

```typescript
type UserId = Brand<string, 'UserId'>
type PostId = Brand<string, 'PostId'>

function getUser(id: UserId) { /* ... */ }

const postId = "post-123" as PostId
getUser(postId) // TS Error: PostId is not assignable to UserId
```

---

## 3. Implementation Patterns

### 3.1 Pattern A: `__brand` Property

The simplest and most widely used approach.

```typescript
type Brand<K, T> = K & { __brand: T }

type UserId = Brand<string, 'UserId'>
type PostId = Brand<string, 'PostId'>
```

**Pros:**
- Simple to understand and implement
- Widely used in the community
- Minimal boilerplate

**Cons:**
- `__brand` appears in IntelliSense autocomplete (doesn't exist at runtime)
- Brand name collisions: two types with `Brand<string, 'Id'>` in different files are treated as the same type
- Less strict than symbol-based approaches

### 3.2 Pattern B: Per-Type `unique symbol`

Each branded type gets its own unique symbol, providing the strongest nominal guarantees.

```typescript
declare const UserIdBrand: unique symbol
type UserId = string & { readonly [UserIdBrand]: true }

declare const PostIdBrand: unique symbol
type PostId = string & { readonly [PostIdBrand]: true }

declare const EmailBrand: unique symbol
type Email = string & { readonly [EmailBrand]: true }
```

**Pros:**
- Strongest guarantees — each symbol is truly unique, even across files
- No brand name collisions possible
- Best for library authors exposing branded types in public APIs

**Cons:**
- Most verbose — requires `declare const` + `unique symbol` per type
- More boilerplate to maintain
- Harder to compose or build generic utilities around

**When to use:** Authoring a library or need absolute uniqueness across module boundaries.

### 3.3 Pattern C: Generic `unique symbol` (Recommended)

Balances safety and ergonomics. One shared symbol, differentiated by the string literal brand.

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type UserId    = Brand<string, 'UserId'>
type PostId    = Brand<string, 'PostId'>
type Meters    = Brand<number, 'Meters'>
type Seconds   = Brand<number, 'Seconds'>
```

**Pros:**
- Clean, one-liner type definitions
- Symbol-based — `__brand` doesn't appear in IntelliSense as a regular property
- Brand string provides readable error messages
- Easy to build utilities around (constructor functions, type guards)
- `readonly` prevents accidental assignment

**Cons:**
- Two types with the same brand string share the brand — use descriptive names
- Slightly less strict than per-type unique symbols

**When to use:** Default choice for application code. Covers 95% of use cases.

### 3.4 Comparison Table

| Criteria | A: `__brand` | B: Per-type symbol | C: Generic symbol |
|----------|-------------|-------------------|-------------------|
| Setup complexity | Low | High | Low |
| Brand uniqueness | String-based | Absolute | String-based |
| IntelliSense noise | Yes (`__brand` visible) | Minimal | Minimal |
| Cross-file safety | Collision risk | Safe | Collision risk (use descriptive names) |
| Library authoring | Not recommended | Best | Good |
| Application code | Good | Overkill | **Best** |
| Composability | Good | Poor | Good |

---

## 4. Constructor Functions

Never use bare `as` casts in application code. Confine them to constructor/validation functions.

### 4.1 Manual Constructors

```typescript
function createUserId(id: string): UserId {
  if (!id || id.length === 0) throw new Error('Invalid UserId')
  return id as UserId
}

function validateEmail(input: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
    throw new Error('Invalid email')
  }
  return input as Email
}

function toPositiveInt(n: number): PositiveInt {
  if (!Number.isInteger(n) || n <= 0) throw new Error('Must be positive integer')
  return n as PositiveInt
}
```

### 4.2 Generic Constructor Factory

A reusable pattern for creating branded constructors with validation:

```typescript
function createBrandedConstructor<T, B extends string>(
  brand: B,
  validate: (value: T) => boolean,
  errorMessage?: string,
) {
  return (value: T): Brand<T, B> => {
    if (!validate(value)) {
      throw new Error(errorMessage ?? `Invalid ${brand}: ${value}`)
    }
    return value as Brand<T, B>
  }
}

// Usage
const createUserId = createBrandedConstructor<string, 'UserId'>(
  'UserId',
  (v) => v.length > 0 && /^[a-zA-Z0-9-]+$/.test(v),
)

const toPositiveInt = createBrandedConstructor<number, 'PositiveInt'>(
  'PositiveInt',
  (v) => Number.isInteger(v) && v > 0,
)

const validateEmail = createBrandedConstructor<string, 'Email'>(
  'Email',
  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  'Invalid email address',
)
```

---

## 5. Real-World Use Cases

### Type-safe IDs

```typescript
type UserId    = Brand<string, 'UserId'>
type PostId    = Brand<string, 'PostId'>
type CommentId = Brand<string, 'CommentId'>

function getPost(postId: PostId) { /* ... */ }
function deleteComment(commentId: CommentId) { /* ... */ }
```

### Validated strings

```typescript
type Email           = Brand<string, 'Email'>
type NonEmptyString  = Brand<string, 'NonEmptyString'>
type SanitizedHTML   = Brand<string, 'SanitizedHTML'>
type TranslationKey  = Brand<string, 'TranslationKey'>
```

### Unit-specific numbers

```typescript
type Meters       = Brand<number, 'Meters'>
type Feet         = Brand<number, 'Feet'>
type Seconds      = Brand<number, 'Seconds'>
type Milliseconds = Brand<number, 'Milliseconds'>
type Percentage   = Brand<number, 'Percentage'> // 0-100
```

### Tokens and sensitive values

```typescript
type AccessToken  = Brand<string, 'AccessToken'>
type RefreshToken = Brand<string, 'RefreshToken'>
type ApiKey       = Brand<string, 'ApiKey'>
```

---

## 6. Anti-Patterns

### 1. Checking brand at runtime

```typescript
// WRONG — __brand does not exist at runtime
if ((value as any).__brand === 'UserId') { /* ... */ }
```

Branded types are compile-time only. For runtime checks, use constructor/validation functions.

### 2. Bare `as` casts in application code

```typescript
// BAD — no validation, defeats the purpose
const userId = someString as UserId

// GOOD — validated constructor
const userId = createUserId(someString)
```

Confine `as` casts to constructor functions only.

### 3. Over-branding

Don't brand every `string` or `number`. Use branded types when:
- Mixing values would cause bugs (IDs, units, validated data)
- Multiple similar types exist that should not be interchangeable
- The project is large enough to benefit from the safety

### 4. Duplicate brand names across modules

```typescript
// file-a.ts — Brand<string, 'Id'>
// file-b.ts — Brand<number, 'Id'>
// These share the brand name 'Id' but mean different things!
```

Use specific, descriptive brand names: `'UserId'`, `'PostId'`, not just `'Id'`.

---

## 7. Library Integrations

### 7.1 Zod

Zod has built-in `.brand()` support:

```typescript
import { z } from 'zod'

const UserIdSchema = z.string().uuid().brand<'UserId'>()
type UserId = z.infer<typeof UserIdSchema>
// UserId = string & z.BRAND<'UserId'>

const EmailSchema = z.string().email().brand<'Email'>()
type Email = z.infer<typeof EmailSchema>
```

Parsing produces branded values automatically:

```typescript
const userId = UserIdSchema.parse(input) // typed as UserId
const result = UserIdSchema.safeParse(input)
if (result.success) {
  result.data // UserId
}
```

**Using your own Brand utility with Zod:**

```typescript
const UserIdSchema = z.string().uuid().transform(
  (val): Brand<string, 'UserId'> => val as Brand<string, 'UserId'>
)
```

### 7.2 Drizzle ORM

Use `.$type<T>()` to brand column output types:

```typescript
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id:        text('id').primaryKey().$type<UserId>(),
  email:     text('email').notNull().$type<Email>(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id:       text('id').primaryKey().$type<PostId>(),
  authorId: text('author_id').notNull().$type<UserId>(),
  title:    text('title').notNull(),
})
```

Queries return branded types:

```typescript
const user = await db.select().from(users).where(eq(users.id, userId))
// user.id is UserId, user.email is Email
```

Inserts require branded values:

```typescript
await db.insert(users).values({
  id: createUserId(crypto.randomUUID()),
  email: validateEmail(input.email),
})
```

### 7.3 Prisma

Prisma doesn't support `$type<>()`. Wrap query results instead:

```typescript
function brandUser(user: PrismaUser): BrandedUser {
  return {
    ...user,
    id: user.id as UserId,
    email: user.email as Email,
  }
}

const rawUser = await prisma.user.findUnique({ where: { id: input } })
const user = rawUser ? brandUser(rawUser) : null
```

For inserts, unwrap branded values:

```typescript
await prisma.user.create({
  data: {
    id: createUserId(crypto.randomUUID()) as string,
    email: validateEmail(input.email) as string,
  },
})
```

### 7.4 End-to-End Example

Combining Zod validation with Drizzle queries:

```typescript
// types.ts
import type { Brand } from './brand'
export type UserId = Brand<string, 'UserId'>
export type PostId = Brand<string, 'PostId'>
```

```typescript
// schemas.ts
import { z } from 'zod'
import type { UserId } from './types'

export const GetPostParams = z.object({
  postId: z.string().uuid(),
})

export function createUserId(id: string): UserId {
  z.string().uuid().parse(id)
  return id as UserId
}
```

```typescript
// route.ts
import { db } from './db'
import { posts, users } from './schema'
import { GetPostParams, createUserId } from './schemas'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const { postId } = GetPostParams.parse({
    postId: url.searchParams.get('postId'),
  })

  const post = await db.select().from(posts)
    .where(eq(posts.id, postId as PostId))
    .limit(1)

  if (!post[0]) return Response.json({ error: 'Not found' }, { status: 404 })

  // post[0].authorId is UserId — type-safe join
  const author = await db.select().from(users)
    .where(eq(users.id, post[0].authorId))
    .limit(1)

  return Response.json({ post: post[0], author: author[0] })
}
```

---

## 8. Advanced Utilities

### 8.1 Composing Multiple Brands

Stack brands to express multiple constraints:

```typescript
type PositiveInt = Brand<number, 'PositiveInt'>
type EvenNumber  = Brand<number, 'EvenNumber'>

// A number that is both positive and even
type PositiveEvenInt = PositiveInt & EvenNumber
```

Constructor for the composed type:

```typescript
function toPositiveEvenInt(n: number): PositiveEvenInt {
  if (!Number.isInteger(n) || n <= 0) throw new Error('Must be positive integer')
  if (n % 2 !== 0) throw new Error('Must be even')
  return n as unknown as PositiveEvenInt
}
```

Note the `as unknown as` double cast — needed because `PositiveInt` and `EvenNumber` have incompatible brand strings. Safe inside constructor functions where validation is performed.

### 8.2 Extracting the Base Type

Unwrap a branded type back to its base:

```typescript
type Unbrand<T> = T extends Brand<infer U, string> ? U : T

type Base  = Unbrand<UserId> // string
type Base2 = Unbrand<Meters> // number
```

Useful for generic utilities that operate on the underlying value regardless of brand.

---

## 9. Decision Table

| Scenario | Use branded types? |
|----------|-------------------|
| Multiple ID types that should not mix | Yes |
| Validated vs. unvalidated data | Yes |
| Unit-specific numbers (meters vs feet) | Yes |
| Tokens/secrets vs plain strings | Yes |
| Small script with few types | Probably not |
| Single ID type in a small project | Probably not |
| Need runtime type discrimination | Use discriminated unions instead |

**Default pattern:** Pattern C (`Brand<T, B>` with `unique symbol`).
**Default rule:** All `as` casts live in constructor functions, never in application code.

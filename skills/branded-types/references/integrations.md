# Branded Types — Library Integrations

How to use branded types with popular TypeScript libraries.

## Shared Brand Utility

All examples below assume this shared utility:

```typescript
// brand.ts
declare const __brand: unique symbol
export type Brand<T, B extends string> = T & { readonly [__brand]: B }
```

---

## Zod

Zod has built-in `.brand()` support. Branded schemas produce branded output types automatically.

### Basic usage

```typescript
import { z } from 'zod'

const UserIdSchema = z.string().uuid().brand<'UserId'>()
type UserId = z.infer<typeof UserIdSchema>
// UserId = string & z.BRAND<'UserId'>

const EmailSchema = z.string().email().brand<'Email'>()
type Email = z.infer<typeof EmailSchema>
```

### Parsing produces branded values

```typescript
const userId = UserIdSchema.parse(input)
// userId is typed as UserId — no manual `as` cast needed

const result = UserIdSchema.safeParse(input)
if (result.success) {
  result.data // UserId
}
```

### Using your own Brand utility with Zod

If you want your branded types to use your custom `Brand<T, B>` instead of Zod's `z.BRAND`, create a wrapper:

```typescript
import type { Brand } from './brand'

function parseUserId(input: unknown): Brand<string, 'UserId'> {
  const parsed = z.string().uuid().parse(input)
  return parsed as Brand<string, 'UserId'>
}
```

Or use `.transform()`:

```typescript
const UserIdSchema = z.string().uuid().transform(
  (val): Brand<string, 'UserId'> => val as Brand<string, 'UserId'>
)
```

---

## Drizzle ORM

Use `.$type<T>()` to brand column output types. Queries will return branded values.

### Table definition

```typescript
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import type { Brand } from './brand'

type UserId = Brand<string, 'UserId'>
type PostId = Brand<string, 'PostId'>
type Email  = Brand<string, 'Email'>

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

### Queries return branded types

```typescript
const user = await db.select().from(users).where(eq(users.id, userId))
// user.id is UserId, user.email is Email

const post = await db.select().from(posts).where(eq(posts.authorId, userId))
// post.id is PostId, post.authorId is UserId
```

### Inserts require branded values

```typescript
import { createUserId, validateEmail } from './constructors'

await db.insert(users).values({
  id: createUserId(crypto.randomUUID()),
  email: validateEmail(input.email),
})
```

---

## End-to-End Example: API Route

Combining Zod validation with Drizzle queries and branded types:

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
  z.string().uuid().parse(id) // validate
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

  // postId is validated string; cast to PostId for query
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

## Generic Validation Function Pattern

A reusable pattern for creating branded constructors with validation:

```typescript
import type { Brand } from './brand'

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

## Prisma

Prisma doesn't support `$type<>()` like Drizzle. Wrap query results instead:

```typescript
import type { Brand } from './brand'

type UserId = Brand<string, 'UserId'>

// Wrapper for Prisma results
function brandUser(user: PrismaUser): BrandedUser {
  return {
    ...user,
    id: user.id as UserId,
    email: user.email as Email,
  }
}

const rawUser = await prisma.user.findUnique({ where: { id: input } })
const user = rawUser ? brandUser(rawUser) : null
// user.id is now UserId
```

For inserts, use constructor functions to validate before passing to Prisma:

```typescript
await prisma.user.create({
  data: {
    id: createUserId(crypto.randomUUID()) as string, // unwrap for Prisma
    email: validateEmail(input.email) as string,
  },
})
```

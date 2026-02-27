# Branded Types — Implementation Patterns

Three main approaches to implementing branded types in TypeScript, each with different trade-offs.

## Pattern A: `__brand` Property

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
- `__brand` appears in IntelliSense autocomplete (it doesn't exist at runtime)
- Brand name collisions: two types with `Brand<string, 'Id'>` in different files are treated as the same type
- Less strict than symbol-based approaches

## Pattern B: Per-Type `unique symbol`

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
- Most verbose — requires a `declare const` + `unique symbol` per type
- More boilerplate to maintain
- Harder to compose or build generic utilities around

**When to use:** When you're authoring a library or need absolute uniqueness guarantees across module boundaries.

## Pattern C: Generic Utility with Single `unique symbol` (Recommended)

Balances safety and ergonomics. One shared symbol, differentiated by the string literal brand.

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

// Usage
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
- Two types with the same brand string (e.g., `Brand<string, 'Id'>` and `Brand<number, 'Id'>`) share the brand — use descriptive names to avoid this
- Slightly less strict than per-type unique symbols

**When to use:** Default choice for application code. Covers 95% of use cases.

## Comparison Table

| Criteria | A: `__brand` | B: Per-type symbol | C: Generic symbol |
|----------|-------------|-------------------|-------------------|
| Setup complexity | Low | High | Low |
| Brand uniqueness | String-based | Absolute | String-based |
| IntelliSense noise | Yes (`__brand` visible) | Minimal | Minimal |
| Cross-file safety | Collision risk | Safe | Collision risk (use descriptive names) |
| Library authoring | Not recommended | Best | Good |
| Application code | Good | Overkill | Best |
| Composability | Good | Poor | Good |

## Composing Multiple Brands

With Pattern C you can stack brands to express multiple constraints:

```typescript
type PositiveInt = Brand<number, 'PositiveInt'>
type EvenNumber  = Brand<number, 'EvenNumber'>

// A number that is both positive and even
type PositiveEvenInt = PositiveInt & EvenNumber
```

Constructor function for the composed type:

```typescript
function toPositiveEvenInt(n: number): PositiveEvenInt {
  if (!Number.isInteger(n) || n <= 0) throw new Error('Must be positive integer')
  if (n % 2 !== 0) throw new Error('Must be even')
  return n as unknown as PositiveEvenInt
}
```

Note the `as unknown as` double cast — needed because `PositiveInt` and `EvenNumber` have incompatible brand strings. This is safe inside constructor functions where validation is performed.

## Extracting the Base Type

Sometimes you need to "unwrap" a branded type back to its base:

```typescript
type Unbrand<T> = T extends Brand<infer U, string> ? U : T

type Base = Unbrand<UserId> // string
type Base2 = Unbrand<Meters> // number
```

Useful for generic utilities that operate on the underlying value regardless of brand.

## Recommendation

**Use Pattern C** (`Brand<T, B>` with a single `unique symbol`) for application code. Switch to **Pattern B** (per-type `unique symbol`) only when:
- You're building a library with public branded types
- You need absolute uniqueness across package boundaries
- Multiple teams might independently create branded types with similar names

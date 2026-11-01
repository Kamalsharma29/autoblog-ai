---
title: "Narrow Union Types Before You Use Their Fields"
date: 2026-11-01
category: "TypeScript"
status: draft
generator: template
review: required
---

# Narrow Union Types Before You Use Their Fields

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

A union describes a value that may be one of several shapes. TypeScript will not let you read a field that exists on only one of those shapes until a check narrows the union.

Discriminated unions make the check explicit. A shared literal field such as ok tells both the compiler and the reader which shape is present. After if (result.ok), the success fields are available in that branch and the error fields are available in the other.

## Practical example

```ts
type Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

function message(result: Result): string {
  if (result.ok) {
    return result.value;
  }

  return result.error;
}

function lengthOf(value: string | null): number {
  if (value === null) return 0;
  return value.length;
}
```

## Key takeaways

- A union member's unique fields are available only after a narrowing check.
- A shared literal property is a clear discriminant for objects.
- Equality checks such as value === null narrow primitive unions.
- Put the unhappy path in its own branch so the success path stays precise.

## Conclusion

Narrowing is a control-flow proof. Use a real result type from your application in the published version, and keep the discriminant stable so every caller checks the same field.

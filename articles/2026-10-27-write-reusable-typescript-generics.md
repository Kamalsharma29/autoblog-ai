---
title: "Write a Small Generic Instead of Repeating a Function"
date: 2026-10-27
category: "TypeScript"
status: draft
generator: template
review: required
---

# Write a Small Generic Instead of Repeating a Function

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

A generic function keeps a type parameter so the output can depend on the input. The caller does not pass a type in most cases. TypeScript infers it from the argument.

Generics are a poor fit when the parameter never appears in the arguments or the return type. They are a good fit when two call sites share an algorithm but not a concrete type, such as taking the first item of any array.

## Practical example

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const label = first(["draft", "review"]);
const count = first([3, 1, 4]);

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Request failed: " + response.status);
  }
  return (await response.json()) as T;
}
```

## Key takeaways

- Use a type parameter when the result type depends on an argument.
- readonly T[] accepts both mutable and readonly arrays.
- Inference from the argument is usually clearer than writing first<string>(...).
- A JSON helper still needs a declared response type because the network payload is untyped.

## Conclusion

Start with a concrete function, then generalize the part that varies. In a review, check that each type parameter appears in the signature for a reason and that the JSON cast is documented as a boundary assumption.

---
title: "Understanding JavaScript Closures with a Small Counter"
date: 2026-10-28
category: "JavaScript"
status: draft
generator: template
review: required
---

# Understanding JavaScript Closures with a Small Counter

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

A closure is a function that keeps access to the variables in the scope where it was created, even after that outer function has returned. Closures are how JavaScript gives functions private state without a class.

They show up in callbacks, event handlers, and factory functions. The useful part is remembering a value. The tricky part is remembering which value: a loop that shares one binding will surprise you, while a new binding per call stays independent.

## Practical example

```js
function createCounter(start = 0) {
  let value = start;

  return {
    increment() {
      value += 1;
      return value;
    },
    read() {
      return value;
    },
  };
}

const visits = createCounter();
console.log(visits.increment());
console.log(visits.increment());
console.log(visits.read());
```

## Key takeaways

- A closure keeps the surrounding bindings alive for as long as the inner function can be called.
- Factory functions are a direct way to give each object its own private state.
- Declare loop variables with let or const so each callback closes over a separate binding.
- A large object captured by a long-lived listener can stay in memory longer than you expect.

## Conclusion

Treat a closure as private state plus behavior. When a callback remembers the wrong value, look at where the binding was declared before changing the logic around it. This draft is a starting point for a fuller explanation with examples from your own codebase.

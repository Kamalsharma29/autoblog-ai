---
title: "How the JavaScript Event Loop Schedules Work"
date: 2026-10-30
category: "JavaScript"
status: draft
generator: template
review: required
---

# How the JavaScript Event Loop Schedules Work

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

JavaScript runs one call stack at a time on the main thread. Timers, promises, and DOM events do not interrupt a running function. They wait in queues, and the event loop pulls them in only after the stack is clear.

Promise reactions go through the microtask queue, which is drained before the next timer or I/O callback. That order explains why a resolved promise logs before a setTimeout of zero milliseconds, and why a microtask that queues another microtask can delay rendering and timers.

## Practical example

```js
console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");

// Order: start, end, promise, timeout
```

## Key takeaways

- Synchronous code finishes before the event loop can run a queued callback.
- Promise callbacks run as microtasks, ahead of timer callbacks.
- A timeout of zero milliseconds still waits for the current stack and the microtask queue.
- Keep long loops off the main thread so timers and input can run.

## Conclusion

When logs appear out of the order you expected, write down which steps are synchronous, which are microtasks, and which are timers. The event loop is predictable once those three buckets are separate. Review the examples against the runtime you ship before publishing.

---
title: "Handle Async Errors at the Boundary in Node.js"
date: 2026-10-24
category: "Node.js"
status: draft
generator: template
review: required
---

# Handle Async Errors at the Boundary in Node.js

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

An async function returns a promise. A throw inside it rejects that promise. If nobody awaits it or attaches a rejection handler, Node.js reports an unhandled rejection.

Handle the failure at the boundary that started the work: a request listener, a queue consumer, or the main function of a script. Lower-level functions can add context and rethrow. They should not decide process-wide policy on their own unless that is their job.

## Practical example

```js
import { readFile } from "node:fs/promises";

async function loadSettings() {
  const raw = await readFile("settings.json", "utf8");
  const settings = JSON.parse(raw);

  if (!settings.appName) {
    throw new Error("settings.appName is required");
  }

  return settings;
}

async function main() {
  try {
    const settings = await loadSettings();
    console.log("Starting", settings.appName);
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exitCode = 1;
  }
}

await main();
```

## Key takeaways

- Await async work, or handle the returned promise, at the edge of the program.
- Include the operation in the error message so logs explain what failed.
- Leave process.exitCode to the top-level caller instead of exiting from a library function.
- JSON.parse and file reads both throw or reject, so one try covers both in an async function.

## Conclusion

Decide where failures are logged and where they are recovered. A draft about your own service should name that boundary, then show one unhappy path rather than a generic catch that hides the stack.

---
title: "Stream a File Through pipeline in Node.js"
date: 2026-11-02
category: "Node.js"
status: draft
generator: template
review: required
---

# Stream a File Through pipeline in Node.js

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

Reading a large file with fs.readFile buffers the whole file in memory. Streams move it in chunks. Backpressure lets a slow destination pause the source so those chunks do not pile up.

pipeline from node:stream/promises connects the streams and forwards errors. It also destroys the streams if one of them fails, which is easy to miss when you wire data and error events by hand.

## Practical example

```js
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

export async function compressLog(sourcePath, destinationPath) {
  await pipeline(
    createReadStream(sourcePath),
    createGzip(),
    createWriteStream(destinationPath)
  );
}

await compressLog("report.log", "report.log.gz");
```

## Key takeaways

- Prefer streams when the file may be larger than the memory you want to spend.
- pipeline waits until the destination finishes and rejects if any stream errors.
- Gzip sits between the read stream and the write stream as a transform.
- Pass paths in from configuration. Do not hardcode a machine-specific directory in the module.

## Conclusion

pipeline is the default shape for file transforms in Node.js. Extend this draft with the stream your readers use, such as CSV parsing or an HTTP response body, and keep the error path visible.

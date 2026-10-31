---
title: "Evaluate an AI Feature with a Fixed Rubric"
date: 2026-10-31
category: "AI development"
status: draft
generator: template
review: required
---

# Evaluate an AI Feature with a Fixed Rubric

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

An AI-backed feature needs a check that does not depend on a live model call. A rubric can score a draft for the properties you care about: a title, an example, a review status, and the sections a reader was promised.

Run that rubric in tests against saved examples. A model response, if you add one later, is another input to the same scorer. The scorer stays local, repeatable, and free of API keys.

## Practical example

```js
export function scoreDraft(article) {
  const checks = [
    { name: "title", pass: /^#\s+\S+/m.test(article) },
    { name: "example", pass: article.includes("```") },
    { name: "takeaways", pass: article.includes("## Key takeaways") },
    { name: "draft", pass: /status:\s*draft/i.test(article) },
  ];

  const passed = checks.filter((check) => check.pass).length;
  return { passed, total: checks.length, checks };
}
```

## Key takeaways

- Write the expected properties down before you judge sample output.
- Keep the scorer deterministic so a test can run without a network call.
- Store failing samples next to the rubric and update either the sample or the check on purpose.
- A passing rubric does not publish the article. A person still reviews a draft.

## Conclusion

Evaluation is part of the feature, not a one-time manual read. Expand this rubric with the mistakes your readers are likely to ship, and keep every check runnable on a laptop.

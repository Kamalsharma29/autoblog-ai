---
title: "Ship Work on a Short-Lived Git Branch"
date: 2026-10-26
category: "Git"
status: draft
generator: template
review: required
---

# Ship Work on a Short-Lived Git Branch

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

A short-lived branch isolates one change from the main line until it is reviewed. The branch starts from current main, contains a focused commit, and is merged or closed instead of collecting unrelated fixes.

The daily article workflow in this repository follows the same idea. Generation may commit a new draft, but a person still reviews the Markdown before it is published. The branch history should make that review easy to follow.

## Practical example

```bash
git switch main
git pull
git switch -c feature/order-index

git add -- src/orders.sql
git commit -m "Index orders by customer"
git push -u origin feature/order-index
```

## Key takeaways

- Start a feature branch from the current main branch.
- Stage only the files that belong to the change.
- Write a commit message that says why the change exists.
- Push the branch and open a review instead of editing main directly on a shared repo.

## Conclusion

Keep the branch about one outcome. If the review points out a problem, add another commit on that branch. Update the commands in this draft if your team uses a different default branch name.

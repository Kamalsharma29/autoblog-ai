---
title: "Keep Related SQL Writes in One Transaction"
date: 2026-10-25
category: "SQL"
status: draft
generator: template
review: required
---

# Keep Related SQL Writes in One Transaction

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

A transaction makes several writes succeed or fail together. Transferring a balance is the classic case: the debit and the credit must both land, or neither should remain.

Isolation and locks determine what concurrent transactions can observe. You do not need a new isolation level to get the basic guarantee. You do need to begin a transaction, commit after the last successful write, and roll back when a later statement fails.

## Practical example

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
-- If either update fails, run ROLLBACK instead of COMMIT.
```

## Key takeaways

- Wrap writes that represent one business action in a single transaction.
- Check that the debit actually changed a row before committing a transfer.
- ROLLBACK returns the open transaction's writes to the state before BEGIN.
- Hold transactions only for the database work. Do not wait on user input while one is open.

## Conclusion

The important review step is naming the invariant. In this draft the invariant is that money leaves one account only when it arrives in the other. Adjust the amounts, keys, and row checks to the schema you are documenting.

---
title: "Fetch Data in React and Clean Up the Request"
date: 2026-11-03
category: "React"
status: draft
generator: template
review: required
---

# Fetch Data in React and Clean Up the Request

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

Effects are for synchronizing a component with something outside React, such as a network request. The effect runs after render, and the cleanup function runs before the next effect and when the component goes away.

A request that ignores an outdated response can paint stale data after the user has already switched records. Abort the previous request, or ignore its result, whenever the dependency that identified the request changes.

## Practical example

```jsx
import { useEffect, useState } from "react";

export function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/users/" + userId, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Request failed: " + response.status);
        }
        setUser(await response.json());
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    }

    load();
    return () => controller.abort();
  }, [userId]);

  if (error) return <p role="alert">{error}</p>;
  if (!user) return <p>Loading...</p>;
  return <h2>{user.name}</h2>;
}
```

## Key takeaways

- Put the request in an effect when it must stay in sync with props such as userId.
- Return a cleanup function that aborts work belonging to the previous render.
- Ignore AbortError so a normal dependency change does not look like a failure.
- List every reactive value the effect reads in the dependency array.

## Conclusion

A loading state, an error state, and a cancelled request belong together. Before publishing, adapt the endpoint and the rendered fields to the API your readers actually call.

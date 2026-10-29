---
title: "Prefer Composition When a React Component Grows"
date: 2026-10-29
category: "React"
status: draft
generator: template
review: required
---

# Prefer Composition When a React Component Grows

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

A component with a boolean for every layout variation becomes hard to read. Composition keeps the parent in charge of structure and passes children, or a small render function, into a focused wrapper.

The wrapper owns the shared chrome. Callers own the content. That split avoids a prop such as showFooter that the wrapper must interpret, and it lets each screen change its content without editing the wrapper.

## Practical example

```jsx
export function Panel({ title, children, actions }) {
  return (
    <section className="panel">
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}

export function AccountPanel() {
  return (
    <Panel
      title="Account"
      actions={<button type="button">Edit</button>}
    >
      <p>Plan: Draft review</p>
    </Panel>
  );
}
```

## Key takeaways

- Use children for content the parent already knows how to render.
- Keep a wrapper responsible for layout, not for every possible business variation.
- Colocate state in the component that uses it until two siblings both need it.
- Add a named prop such as actions when a slot is more specific than children.

## Conclusion

Composition scales by adding slots instead of adding flags. When you edit this draft, replace the sample panel with a component from the interface you want to teach.

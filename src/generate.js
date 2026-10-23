import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TOPICS } from "./topics.js";

const TIME_ZONE = "Asia/Kolkata";
const ARTICLES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "articles"
);

const CATEGORIES = [
  "JavaScript",
  "React",
  "Node.js",
  "SQL",
  "MongoDB",
  "Git",
  "TypeScript",
  "AI development",
];

function assertNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (!Number.isInteger(major) || major < 18) {
    throw new Error(
      `Node.js 18 or newer is required. Current version: ${process.versions.node}`
    );
  }
}

function validateTopics(topics) {
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error("The curated topic list is empty.");
  }

  const slugs = new Set();

  for (const topic of topics) {
    const label = topic?.slug || topic?.title || "unknown topic";
    const textFields = [
      "category",
      "title",
      "slug",
      "introduction",
      "example",
      "conclusion",
    ];

    for (const field of textFields) {
      if (typeof topic?.[field] !== "string" || topic[field].trim() === "") {
        throw new Error(`Topic "${label}" is missing a ${field}.`);
      }
      if (topic[field].includes("\0")) {
        throw new Error(`Topic "${label}" has an invalid ${field}.`);
      }
    }

    if (topic.title.includes("\n") || topic.slug.includes("\n")) {
      throw new Error(`Topic "${label}" has a multiline title or slug.`);
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug)) {
      throw new Error(`Topic "${label}" has an invalid slug.`);
    }

    if (slugs.has(topic.slug)) {
      throw new Error(`Duplicate topic slug: ${topic.slug}`);
    }
    slugs.add(topic.slug);

    if (!CATEGORIES.includes(topic.category)) {
      throw new Error(`Topic "${label}" has an unexpected category.`);
    }

    if (
      !Array.isArray(topic.takeaways) ||
      topic.takeaways.length < 3 ||
      topic.takeaways.some((item) => typeof item !== "string" || item.trim() === "")
    ) {
      throw new Error(`Topic "${label}" needs at least three written takeaways.`);
    }
  }

  for (const category of CATEGORIES) {
    if (!topics.some((topic) => topic.category === category)) {
      throw new Error(`The topic list does not cover ${category}.`);
    }
  }
}

function formatDateInTimeZone(date, timeZone) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not determine the calendar date in ${timeZone}. ${message}`);
  }

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  const formatted = `${values.year}-${values.month}-${values.day}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
    throw new Error(`Unexpected date from ${timeZone}: ${formatted}`);
  }
  return formatted;
}

function selectTopic(date, topics) {
  let hash = 2166136261;
  for (const character of date) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return topics[(hash >>> 0) % topics.length];
}

function yamlQuote(value) {
  return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function renderArticle(topic, date) {
  const takeaways = topic.takeaways.map((item) => `- ${item.trim()}`).join("\n");

  return `---
title: ${yamlQuote(topic.title)}
date: ${date}
category: ${yamlQuote(topic.category)}
status: draft
generator: template
review: required
---

# ${topic.title}

> **Draft for review.** AutoBlog AI created this file from a local template. It is not published. Edit it and decide later whether it should go live.

## Introduction

${topic.introduction.trim()}

## Practical example

${topic.example.trim()}

## Key takeaways

${takeaways}

## Conclusion

${topic.conclusion.trim()}
`;
}

async function findArticlesForDate(date) {
  let entries;
  try {
    entries = await readdir(ARTICLES_DIR, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.startsWith(`${date}-`) &&
        entry.name.endsWith(".md")
    )
    .map((entry) => entry.name)
    .sort();
}

function articlePath(filename) {
  const articlesDir = path.resolve(ARTICLES_DIR);
  const resolved = path.resolve(articlesDir, filename);
  const relative = path.relative(articlesDir, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Refusing to write outside the articles directory.");
  }

  return resolved;
}

async function createDraft(date, topic) {
  const filename = `${date}-${topic.slug}.md`;
  const fullPath = articlePath(filename);

  try {
    await writeFile(fullPath, renderArticle(topic, date), {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (error) {
    if (error && error.code === "EEXIST") {
      console.log(`An article for ${date} already exists:`);
      console.log(`articles/${filename}`);
      console.log("Existing draft was left unchanged.");
      return;
    }
    throw error;
  }

  console.log(`Created draft: articles/${filename}`);
  console.log(`Topic: ${topic.category} — ${topic.title}`);
  console.log("Status: draft (review before publishing)");
}

async function main() {
  assertNodeVersion();
  validateTopics(TOPICS);

  const date = formatDateInTimeZone(new Date(), TIME_ZONE);
  await mkdir(ARTICLES_DIR, { recursive: true });

  const existing = await findArticlesForDate(date);
  if (existing.length > 0) {
    console.log(`An article for ${date} already exists:`);
    for (const name of existing) {
      console.log(`articles/${name}`);
    }
    console.log("Existing draft was left unchanged.");
    return;
  }

  await createDraft(date, selectTopic(date, TOPICS));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Failed to generate the blog draft.");
  console.error(message);
  process.exitCode = 1;
});

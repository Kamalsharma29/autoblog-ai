# AutoBlog AI

AutoBlog AI writes one technical blog draft per day as a Markdown file on disk. The initial version uses **local templates**, not a live AI model. It does not call an AI API, and it does not need an API key.

Generated files are **drafts for review**. Nothing in this project publishes an article to a website. Read and edit a draft before you decide to publish it.

## What the generator does

- Picks one topic from a curated list covering JavaScript, React, Node.js, SQL, MongoDB, Git, TypeScript, and AI development.
- Uses the calendar date in `Asia/Kolkata` (IST).
- Writes `articles/YYYY-MM-DD-topic-slug.md`.
- Includes a title, introduction, practical code example, key takeaways, and conclusion.
- Marks the file as a draft in front matter and at the top of the article.
- Leaves an existing article for that date unchanged, then exits successfully.

Topic choice is a stable hash of the date, so the same day always selects the same template. The prose is written in advance in `src/topics.js`. A later version could replace that selection with a model. This version does not.

## Requirements

- Node.js 18 or newer
- A GitHub repository, only if you want the scheduled workflow

No tokens or API keys are required. Do not add credentials to the source files.

## Create a draft locally

```bash
npm install
npm run generate
```

Run the same command again and the generator reports the existing file instead of rewriting it. Open the Markdown file, edit it, and keep `status: draft` until it has been reviewed.

## GitHub Actions

`.github/workflows/daily-blog.yml` runs at **09:00 IST** (03:30 UTC) and can also be started manually with **Run workflow**.

The workflow:

1. Checks out the repository.
2. Installs dependencies with `npm ci`.
3. Runs `npm run generate`.
4. Commits and pushes only when there is a new file under `articles/` whose name ends in `.md`.

It uses the built-in `GITHUB_TOKEN` through `actions/checkout`. No personal access token is stored in the workflow. The commit is authored as `github-actions[bot]`.

Scheduled runs can start a little after 03:30 UTC. GitHub may also pause schedules on a repository that has been inactive for a long time. Use the manual trigger after you enable Actions, and make a commit or a manual run if a quiet repository stops firing the schedule.

## Project layout

```text
src/generate.js                 Draft generator
src/topics.js                   Curated template articles
articles/                       Generated drafts
.github/workflows/daily-blog.yml Daily schedule and manual trigger
```

## Setup still required on GitHub

These steps are intentionally left for you. This repository does not push or publish on its own.

1. Create a Git repository and push this project only when you want it on GitHub.
2. On GitHub, open **Settings → Actions → General → Workflow permissions** and allow Actions to read and write repository contents.
3. Open the **Actions** tab, select **Daily blog draft**, and run it once with **Run workflow**.
4. Confirm the run added a single new file under `articles/` and did not change other files.
5. Review that draft. Publishing, if you want it, is a separate step you control.

If branch protection blocks the Actions bot from pushing to the default branch, either allow that bot to push or change the workflow later so it opens a pull request. Do not put a personal token in the workflow file to get around branch protection.

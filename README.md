# JAMMIN' Trivia

Static Cloudflare Pages rebuild of [jammintrivia.com](https://www.jammintrivia.com/). The repository preserves the original WordPress page and blog URLs without requiring WordPress, Beaver Builder, PHP, or a database.

## Cloudflare Pages setup

- Production branch: `main`
- Framework preset: `None`
- Build command: `npm run build:pages`
- Build output directory: `dist-pages`
- Node version: `22`

The build creates the homepage, service and location pages, all imported WordPress pages, 1,015 historical blog posts, sitemap, redirects, security headers and robots file.

## Write or schedule a blog post

1. Copy `content/blog/_template.json` to a descriptive filename such as `music-bingo-atlanta-fall-2026.json`.
2. Fill in the title, slug, search description, publication time, image and article HTML.
3. Set `draft` to `false` and commit the file.

The hourly GitHub workflow checks for due posts. When `publishAt` arrives, it makes a small commit that triggers a fresh Cloudflare Pages build. Cloudflare then includes the post automatically. Dates can include an explicit time-zone offset such as `-05:00` or `-06:00`.

## Local build

```bash
npm ci
npm run build:pages
```

Open `dist-pages/index.html` through any local static web server. Do not open it as a `file://` URL because absolute asset paths are designed for the website root.

## Content migration

The imported WordPress data is stored in `content/wordpress/`. Core brand images are stored in `public/assets/legacy/`; historical post media keeps its original WordPress media URL so the complete archive remains visible without bloating routine source updates. Run `npm run import:wordpress` only when intentionally refreshing the archive from the old live site.

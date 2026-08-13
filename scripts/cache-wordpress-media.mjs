import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "wordpress");
const MEDIA_DIR = path.join(ROOT, "public", "assets", "wordpress");
const SOURCE_ORIGIN = "https://www.jammintrivia.com";
const CONTENT_FILES = [
  path.join(CONTENT_DIR, "pages.json"),
  ...Array.from({ length: 21 }, (_, index) =>
    path.join(CONTENT_DIR, `posts-${String(index + 1).padStart(3, "0")}.json`),
  ),
];

const absoluteMedia = /https?:\/\/(?:www\.)?jammintrivia\.com\/wp-content\/uploads\/[^\s\"'<>\\]+/gi;
const relativeMedia = /(?<![\w/])\/wp-content\/uploads\/[^\s\"'<>\\]+/gi;

function normalizeSource(value) {
  const decoded = value
    .replaceAll("&#038;", "&")
    .replaceAll("&amp;", "&")
    .replace(/[),.;:]+$/, "");
  const url = new URL(decoded, SOURCE_ORIGIN);
  url.protocol = "https:";
  url.hostname = "www.jammintrivia.com";
  url.hash = "";
  url.search = "";
  return url;
}

function safeSegment(segment) {
  let decoded = segment;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    // Keep malformed legacy percent-encoding usable.
  }
  return decoded.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^\.+$/, "file");
}

function destinationFor(url) {
  const marker = "/wp-content/uploads/";
  const relativePath = url.pathname.slice(url.pathname.indexOf(marker) + marker.length);
  const segments = relativePath.split("/").filter(Boolean).map(safeSegment);
  return {
    disk: path.join(MEDIA_DIR, ...segments),
    publicUrl: `/assets/wordpress/${segments.join("/")}`,
  };
}

async function download(url, diskPath) {
  await mkdir(path.dirname(diskPath), { recursive: true });
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "JAMMIN-Trivia-Media-Migration/1.0" },
        signal: AbortSignal.timeout(45_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = Buffer.from(await response.arrayBuffer());
      if (!body.length) throw new Error("empty response");
      await writeFile(diskPath, body);
      return body.length;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

const documents = new Map();
const occurrences = new Map();

for (const filename of CONTENT_FILES) {
  const raw = await readFile(filename, "utf8");
  documents.set(filename, raw);
  for (const regex of [absoluteMedia, relativeMedia]) {
    regex.lastIndex = 0;
    for (const match of raw.matchAll(regex)) {
      const token = match[0].replace(/[),.;:]+$/, "");
      try {
        const source = normalizeSource(token);
        const key = source.href;
        if (!occurrences.has(key)) occurrences.set(key, { source, tokens: new Set() });
        occurrences.get(key).tokens.add(token);
      } catch {
        console.warn(`Skipping malformed media URL: ${token}`);
      }
    }
  }
}

const jobs = [...occurrences.values()];
const replacements = [];
const failures = [];
let downloadedBytes = 0;
let cursor = 0;

async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    const destination = destinationFor(job.source);
    try {
      const bytes = await download(job.source, destination.disk);
      downloadedBytes += bytes;
      replacements.push({ tokens: job.tokens, publicUrl: destination.publicUrl });
      if (replacements.length % 50 === 0) {
        console.log(`Cached ${replacements.length}/${jobs.length} media files`);
      }
    } catch (error) {
      failures.push(`${job.source.href} (${error.message})`);
    }
  }
}

await mkdir(MEDIA_DIR, { recursive: true });
await Promise.all(Array.from({ length: 8 }, worker));

for (const [filename, original] of documents) {
  let updated = original;
  for (const replacement of replacements) {
    for (const token of replacement.tokens) updated = updated.split(token).join(replacement.publicUrl);
  }
  if (updated !== original) await writeFile(filename, updated);
}

console.log(
  `Cached ${replacements.length}/${jobs.length} WordPress media files (${(
    downloadedBytes /
    1024 /
    1024
  ).toFixed(1)} MiB).`,
);
if (failures.length) {
  console.warn(`${failures.length} unavailable legacy files remain on their original URLs:`);
  for (const failure of failures) console.warn(`- ${failure}`);
}

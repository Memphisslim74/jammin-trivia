import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content", "blog");
const stateFile = path.join(contentDir, ".published.json");
const files = (await fs.readdir(contentDir)).filter((file) => file.endsWith(".json") && !file.startsWith("_") && file !== ".published.json");
const previous = JSON.parse(await fs.readFile(stateFile, "utf8").catch(() => "[]"));
const published = new Set(previous);
const now = Date.now();
const newlyDue = [];

for (const file of files) {
  const post = JSON.parse(await fs.readFile(path.join(contentDir, file), "utf8"));
  if (post.draft || !post.publishAt || new Date(post.publishAt).getTime() > now || published.has(file)) continue;
  published.add(file);
  newlyDue.push(file);
}

if (newlyDue.length) {
  await fs.writeFile(stateFile, `${JSON.stringify([...published].sort(), null, 2)}\n`);
  console.log(`Publishing: ${newlyDue.join(", ")}`);
} else {
  console.log("No scheduled posts are due.");
}

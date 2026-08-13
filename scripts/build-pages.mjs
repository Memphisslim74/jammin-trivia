import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "dist-pages");
const siteUrl = process.env.SITE_URL || "https://www.jammintrivia.com";
const inquiryUrl = "https://jdjclients.com/request_information.asp?djidnumber=23469";
async function loadPosts() {
  const directory = path.join(root, "content", "wordpress");
  try {
    return JSON.parse(await fs.readFile(path.join(directory, "posts.json"), "utf8"));
  } catch {
    const files = (await fs.readdir(directory)).filter((file) => /^posts-\d+\.json$/.test(file)).sort();
    const chunks = await Promise.all(files.map(async (file) => JSON.parse(await fs.readFile(path.join(directory, file), "utf8"))));
    return chunks.flat();
  }
}

const posts = await loadPosts();
const pages = JSON.parse(await fs.readFile(path.join(root, "content/wordpress/pages.json"), "utf8"));
const categories = JSON.parse(await fs.readFile(path.join(root, "content/wordpress/categories.json"), "utf8"));

const logo = "/assets/legacy/9b51ff243b-trivia-dj-logo-170102-586ae6ac0d14d.png";
const hero = "/assets/legacy/d37b7a8f49-Untitled-1-5d6eb54a9ed3b.jpg";
const stateImages = {
  colorado: "/assets/legacy/b23fc05315-Colorado.jpg",
  georgia: "/assets/legacy/fc72481742-Georgia.jpg",
  oregon: "/assets/legacy/a1b8f446dc-View-gallery-letsplay-5f1ce58c9f307.jpg",
};

const serviceData = [
  {
    slug: "jammin-trivia",
    title: "JAMMIN’ Trivia",
    eyebrow: "The original high-energy game",
    image: "/assets/legacy/722004efbb-trivia-3d-logo-5f1cfd293645c.jpg",
    copy: "A professional DJ host, electronic answer pads, visual presentation, great questions and a room full of energy. Teams play free and compete for prizes while your venue builds a weekly crowd.",
  },
  {
    slug: "jammin-feud",
    title: "JAMMIN’ Feud",
    eyebrow: "Game-show energy",
    image: "/assets/legacy/606de91e1f-j-feud-5f1cfd24af535.jpg",
    copy: "A twist on the classic team game: four rounds of feud-style questions, head-to-head competition and a championship showdown for the two highest-scoring teams.",
  },
  {
    slug: "jammin-jukebox-trivia",
    title: "JAMMIN’ Jukebox Trivia",
    eyebrow: "Name that tune—fast",
    image: "/assets/legacy/2e114a83e6-JAMMIN-Jukebox-Trivia-Transparent.png",
    copy: "Four fast-paced rounds challenge players to identify songs and artists across genres and eras. Answers go in from a phone, and faster correct answers earn more points.",
  },
  {
    slug: "music-bingo",
    title: "Music Bingo",
    eyebrow: "Listen. Match. Win.",
    image: "/assets/legacy/c5cc41e6a6-bingo-sm-5f1cfe76915e1.jpg",
    copy: "The familiar fun of bingo meets a party-ready soundtrack. Players identify songs, mark their cards and sing along while a professional host keeps the game moving.",
  },
  {
    slug: "themed-trivia-nights",
    title: "Themed Trivia Nights",
    eyebrow: "Built for fandoms",
    image: "/assets/legacy/ad0e49d825-the-office-5f2f74bddaeb9.jpg",
    copy: "Bring your audience together around the shows, movies, decades and subjects they love. Themes can be tailored to your venue, community or private event.",
  },
  {
    slug: "jammin-insync",
    title: "JAMMIN’ InSync",
    eyebrow: "Lip-sync battle",
    image: "/assets/legacy/1e36133039-n-sync-3d-logo-5f1cfd28479b4.jpg",
    copy: "Contestants choose their songs, bring the props and compete through crowd-pleasing lip-sync rounds. Perfect for a feature night that turns guests into the show.",
  },
  {
    slug: "feud-after-dark",
    title: "Feud After Dark",
    eyebrow: "For adult audiences",
    image: "/assets/legacy/606de91e1f-j-feud-5f1cfd24af535.jpg",
    copy: "A rated-R variation of JAMMIN’ Feud created for adult venues, late-night crowds and private parties that want a more irreverent game-show experience.",
  },
  {
    slug: "jammbulance",
    title: "The JAMMbulance",
    eyebrow: "Entertainment that arrives loud",
    image: "/assets/legacy/07671ad0ee-Jammbulance-patch-FF-5da765c4ba237-300x209.png",
    copy: "A mobile entertainment platform for outdoor events, races, car shows, tailgates, corporate picnics, school events and grand openings—with rooftop DJ capability and a serious sound system.",
  },
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function textOnly(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\[[^\]]+\]/g, " ").replace(/\s+/g, " ").trim();
}

function safeLegacyHtml(value = "") {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, "")
    .replace(/\son\w+=("[^"]*"|'[^']*')/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/https?:\/\/(?:www\.)?jammintrivia\.com/gi, "")
    .replace(/href=(['"])\/client-area\/?\1/gi, (_match, quote) => `href=${quote}${inquiryUrl}${quote}`)
    .replace(/(["'(])\/([^"'()]*wp-content\/uploads\/)/gi, "$1https://www.jammintrivia.com/$2")
    .replace(/(["'(])\/graphics\//gi, "$1https://www.jammintrivia.com/graphics/");
}

function nav() {
  return `<div class="topbar"><span>High Energy Trivia Entertainment</span><a href="tel:8004451204">Call 800-445-1204</a></div>
  <header class="site-header">
    <a class="brand" href="/" aria-label="JAMMIN' Trivia home"><img src="${logo}" alt="JAMMIN' Trivia" width="282" height="106"></a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span><b class="sr-only">Open menu</b></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
      <a href="/where-to-play/">Where to Play</a>
      <a href="/services/">Games & Services</a>
      <a href="/bar-owners-managers/">For Venues</a>
      <a href="/how-to-play/">How to Play</a>
      <a href="/blog/">Blog</a>
      <a class="nav-cta" href="${inquiryUrl}">Get Started</a>
    </nav>
  </header>`;
}

function footer() {
  return `<section class="final-cta"><div><p class="eyebrow">Ready to turn up a slow night?</p><h2>Bring the JAMMIN’ experience to your venue.</h2></div><a class="button light" href="${inquiryUrl}">Book a free consultation</a></section>
  <footer class="site-footer"><div class="footer-grid"><div><img src="${logo}" alt="JAMMIN' Trivia" width="220" height="83"><p>Restaurant, pub, bar, brewery and corporate trivia entertainment across Colorado, Georgia and Oregon.</p></div><div><h3>Explore</h3><a href="/where-to-play/">Where to Play</a><a href="/services/">Services</a><a href="/history/">Our History</a><a href="/blog/">Blog & News</a></div><div><h3>Connect</h3><a href="tel:8004451204">800-445-1204</a><a href="${inquiryUrl}">Contact Us</a><a href="https://www.facebook.com/JAMMINTrivia/" rel="noopener">Facebook</a><a href="https://www.instagram.com/jammintrivia/" rel="noopener">Instagram</a></div></div><div class="legal"><span>© ${new Date().getFullYear()} Infinity Entertainment. All rights reserved.</span><a href="/privacy-policy/">Privacy Policy</a></div></footer>`;
}

function layout({ title, description, pathName = "/", body, image = hero, extraHead = "" }) {
  const canonical = `${siteUrl}${pathName}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | JAMMIN' Trivia</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${siteUrl}${image}"><link rel="icon" href="/assets/legacy/9b51ff243b-trivia-dj-logo-170102-586ae6ac0d14d.png"><link rel="stylesheet" href="/assets/site.css">${extraHead}</head><body>${nav()}<main>${body}</main>${footer()}<script src="/assets/site.js" defer></script></body></html>`;
}

function heroBlock({ eyebrow, title, copy, buttons = true, compact = false, background = hero }) {
  return `<section class="page-hero ${compact ? "compact" : ""}" style="--hero:url('${background}')"><div class="hero-shade"></div><div class="hero-content"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${copy}</p>${buttons ? `<div class="button-row"><a class="button" href="/where-to-play/">Find a show</a><a class="button ghost" href="${inquiryUrl}">Bring us to your venue</a></div>` : ""}</div></section>`;
}

function contactForm(subject = "JAMMIN' Trivia inquiry") {
  return `<form class="contact-form" data-mail-form data-subject="${escapeHtml(subject)}"><div class="form-grid"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Phone<input name="phone" type="tel" autocomplete="tel"></label><label>Venue or company<input name="company" autocomplete="organization"></label><label class="full">How can we help?<textarea name="message" rows="5" required></textarea></label><label class="consent full"><input type="checkbox" required> I agree to the <a href="/privacy-policy/">privacy policy</a>.</label></div><button class="button" type="submit">Send request</button><p class="form-status" data-form-status aria-live="polite"></p></form>`;
}

function serviceCards() {
  return `<div class="card-grid services">${serviceData.map((service) => `<article class="service-card"><div class="card-image"><img src="${service.image}" alt="${escapeHtml(service.title)}" loading="lazy"></div><div class="card-copy"><p class="eyebrow">${service.eyebrow}</p><h3>${service.title}</h3><p>${service.copy}</p><a class="text-link" href="/services/${service.slug}/">Explore ${service.title} <span>→</span></a></div></article>`).join("")}</div>`;
}

function homePage() {
  const recent = posts.filter((post) => post.path.includes("/atlanta-trivia/") || post.date >= "2024-01-01").slice(0, 3);
  const body = `${heroBlock({ eyebrow: "Free to play. Hard to forget.", title: "Trivia nights that turn a venue into <em>the</em> place to be.", copy: "Professional DJ hosts, electronic gameplay and full-service promotion—built to fill seats, create regulars and make weeknights feel like an event." })}
  <section class="proof-strip"><div><strong>15+</strong><span>years of high-energy shows</span></div><div><strong>3</strong><span>active regional markets</span></div><div><strong>100%</strong><span>professionally hosted</span></div><div><strong>FREE</strong><span>for players at weekly shows</span></div></section>
  <section class="section intro"><div class="section-heading"><p class="eyebrow">More than questions on a screen</p><h2>We build the room, not just the game.</h2><p>JAMMIN’ Trivia combines talented hosts, proven formats, technology and marketing support to create the kind of weekly entertainment guests plan around.</p></div><div class="feature-grid"><article><span>01</span><h3>Professionally trained hosts</h3><p>High-energy DJs and emcees who read the room, know the regulars and keep every round moving.</p></article><article><span>02</span><h3>Electronic answer pads</h3><p>Fast, accurate scoring with no paper slips, messy handwriting or long pauses between questions.</p></article><article><span>03</span><h3>Promotion included</h3><p>Social promotion, Eventbrite support and complimentary signs help guests discover and remember your event.</p></article></div></section>
  <section class="section dark"><div class="section-heading row"><div><p class="eyebrow">Choose your crowd-pleaser</p><h2>One team. A whole menu of games.</h2></div><a class="button ghost" href="/services/">View every service</a></div>${serviceCards()}</section>
  <section class="section locations-home"><div class="section-heading"><p class="eyebrow">Where to play</p><h2>Find a JAMMIN’ night near you.</h2><p>Weekly shows, special events and new locations across Colorado, Georgia and Oregon.</p></div><div class="state-grid">${["colorado","georgia","oregon"].map((state) => `<a class="state-card" href="/${state === "colorado" ? "colorado-locations" : `events/search-locations-${state === "georgia" ? "atlanta-metro-dj" : "oregon"}`}/" style="--state:url('${stateImages[state]}')"><span>${state}</span><b>View locations →</b></a>`).join("")}</div></section>
  <section class="section testimonials"><div class="section-heading"><p class="eyebrow">Players keep coming back</p><h2>Good questions. Great hosts. Real community.</h2></div><div class="quote-grid"><blockquote><div>★★★★★</div><p>“The hosts are fantastic—always bringing high energy and keeping the atmosphere lively. Trivia nights are the highlight of my week.”</p><cite>Jim R. · Brainiacs</cite></blockquote><blockquote><div>★★★★★</div><p>“Whether you’re a trivia novice or a seasoned pro, you’ll have a blast. Every game night feels unforgettable.”</p><cite>Lauren D. · Quiz Wizards</cite></blockquote><blockquote><div>★★★★★</div><p>“The hosts are charismatic, professional and make everyone feel welcome. JAMMIN’ Trivia never disappoints.”</p><cite>Mary J. · The Tribe</cite></blockquote></div></section>
  <section class="section blog-tease"><div class="section-heading row"><div><p class="eyebrow">From the blog</p><h2>Ideas for better nights out—and busier venues.</h2></div><a class="text-link" href="/blog/">See all posts →</a></div><div class="post-grid">${recent.map(postCard).join("")}</div></section>`;
  return layout({ title: "High-Energy Pub Trivia, Music Bingo & Bar Entertainment", description: "JAMMIN' Trivia brings professional DJ hosts, electronic gameplay, music bingo and venue marketing to Colorado, Georgia and Oregon.", body });
}

function postCard(post) {
  const description = textOnly(post.excerpt || post.content).slice(0, 150);
  return `<article class="post-card">${post.featured ? `<a class="post-image" href="${post.path}"><img src="${post.featured}" alt="" loading="lazy"></a>` : ""}<div><time datetime="${post.date}">${new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time><h3><a href="${post.path}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(description)}</p><a class="text-link" href="${post.path}">Read more →</a></div></article>`;
}

function servicesPage() {
  const body = `${heroBlock({ eyebrow: "Games & live entertainment", title: "A better reason to go out tonight.", copy: "From traditional pub trivia to music games, feud-style showdowns and unforgettable promotional events, every format is built to keep the room engaged.", compact: true })}<section class="section">${serviceCards()}</section>`;
  return layout({ title: "Trivia Games & Entertainment Services", description: "Explore JAMMIN' Trivia, JAMMIN' Feud, Jukebox Trivia, Music Bingo, themed nights and live event entertainment.", pathName: "/services/", body });
}

function servicePage(service) {
  const body = `${heroBlock({ eyebrow: service.eyebrow, title: service.title, copy: service.copy, compact: true, background: service.image })}<section class="section split"><div><p class="eyebrow">Turnkey entertainment</p><h2>Everything needed for a night guests remember.</h2><p>JAMMIN’ provides a trained host, professional sound and presentation, gameplay technology, scoring and a proven show format. Weekly venue programs also include marketing support and complimentary promotional materials.</p><ul class="checklist"><li>Professional DJ host or emcee</li><li>Electronic or mobile gameplay</li><li>Visual presentation and sound</li><li>Promotion and signage support</li><li>Flexible formats for venues and private events</li></ul></div><aside class="contact-panel"><h3>Ask about ${service.title}</h3><p>Tell us about your venue or event and we’ll recommend the best format.</p><a class="button" href="${inquiryUrl}">Request information</a></aside></section>`;
  return layout({ title: service.title, description: service.copy, pathName: `/services/${service.slug}/`, body, image: service.image });
}

function locationsPage() {
  const body = `${heroBlock({ eyebrow: "Where to play", title: "Your next favorite trivia night is closer than you think.", copy: "Explore weekly JAMMIN’ Trivia, music bingo and special events in Colorado, Georgia and Oregon.", compact: true })}<section class="section"><div class="state-grid large">${["colorado","georgia","oregon"].map((state) => `<a class="state-card" href="/${state === "colorado" ? "colorado-locations" : `events/search-locations-${state === "georgia" ? "atlanta-metro-dj" : "oregon"}`}/" style="--state:url('${stateImages[state]}')"><span>${state}</span><b>Open the ${state[0].toUpperCase()+state.slice(1)} map →</b></a>`).join("")}</div></section>`;
  return layout({ title: "Find a Trivia Night Near You", description: "Find JAMMIN' Trivia locations and weekly shows in Colorado, Georgia and Oregon.", pathName: "/where-to-play/", body });
}

function mapPage({ state, pathName, mapUrl }) {
  const body = `${heroBlock({ eyebrow: "Where to play", title: `${state} locations`, copy: "Click a marker to see venue details and start planning your next JAMMIN’ night.", compact: true, background: stateImages[state.toLowerCase()] })}<section class="section map-section"><iframe src="${mapUrl}" title="JAMMIN' Trivia ${state} locations" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="map-note"><h2>Don’t see a location near you?</h2><p>Ask your favorite bar, restaurant or brewery to bring JAMMIN’ Trivia to the neighborhood.</p><a class="button" href="${inquiryUrl}">Recommend a venue</a></div></section>`;
  return layout({ title: `${state} Trivia Locations`, description: `Find JAMMIN' Trivia shows and venue locations in ${state}.`, pathName, body, image: stateImages[state.toLowerCase()] });
}

function blogIndex(allPosts, page = 1) {
  const perPage = 18;
  const start = (page - 1) * perPage;
  const current = allPosts.slice(start, start + perPage);
  const pagesCount = Math.ceil(allPosts.length / perPage);
  const pathName = page === 1 ? "/blog/" : `/blog/page/${page}/`;
  const pagination = `<nav class="pagination" aria-label="Blog pages">${page > 1 ? `<a href="${page === 2 ? "/blog/" : `/blog/page/${page-1}/`}">← Newer</a>` : "<span></span>"}<span>Page ${page} of ${pagesCount}</span>${page < pagesCount ? `<a href="/blog/page/${page+1}/">Older →</a>` : ""}</nav>`;
  const body = `${heroBlock({ eyebrow: "Blog & news", title: "Ideas that make game night better.", copy: "Venue strategy, trivia tips, entertainment trends, location spotlights and the full JAMMIN’ archive.", compact: true })}<section class="section"><div class="blog-tools"><label>Search the archive<input type="search" placeholder="Search by topic or venue…" data-post-search></label><p>${allPosts.length.toLocaleString()} posts preserved from the original site</p></div><div class="post-grid archive" data-post-grid>${current.map(postCard).join("")}</div>${pagination}</section>`;
  return layout({ title: page === 1 ? "Trivia Blog & News" : `Trivia Blog – Page ${page}`, description: "Trivia tips, venue entertainment strategies, event recaps and JAMMIN' Trivia news.", pathName, body });
}

function blogPost(post) {
  const description = textOnly(post.excerpt || post.content).slice(0, 155) || `Read ${post.title} from JAMMIN' Trivia.`;
  const body = `<article class="article"><header>${post.featured ? `<img class="article-hero" src="${post.featured}" alt="" fetchpriority="high">` : ""}<p class="eyebrow">JAMMIN’ Trivia blog</p><h1>${escapeHtml(post.title)}</h1><time datetime="${post.date}">${new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time></header><div class="article-body legacy-content">${safeLegacyHtml(post.content)}</div><footer><a class="text-link" href="/blog/">← Back to the blog</a></footer></article>`;
  return layout({ title: post.title, description, pathName: post.path, body, image: post.featured || hero, extraHead: `<meta property="og:type" content="article"><meta property="article:published_time" content="${post.date}">` });
}

function legacyPage(page) {
  const description = textOnly(page.excerpt || page.content).slice(0, 155) || `${page.title} from JAMMIN' Trivia.`;
  let content = safeLegacyHtml(page.content);
  if (page.path === "/client-area/") content = `<div class="contact-intro"><h2>Let’s build your next great night.</h2><p>Tell us about your venue or event and our team will respond as soon as possible.</p><a class="button" href="${inquiryUrl}">Request information</a></div>`;
  if (page.path === "/submit-a-question/") content = `<div class="contact-intro"><h2>Submit a trivia question</h2><p>Have a great question for the game? Send the category, question and correct answer to our team.</p></div>${contactForm("Trivia question submission")}`;
  const body = `${heroBlock({ eyebrow: "JAMMIN’ Trivia", title: escapeHtml(page.title), copy: description, compact: true, buttons: false })}<section class="section article-body legacy-content">${content}</section>`;
  return layout({ title: page.title, description, pathName: page.path, body, image: page.featured || hero });
}

function outputPath(pathName) {
  const clean = pathName.replace(/^\/+|\/+$/g, "");
  return path.join(out, clean, "index.html");
}

async function writeRoute(pathName, html) {
  const file = outputPath(pathName);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

async function readScheduledPosts() {
  const dir = path.join(root, "content", "blog");
  const files = await fs.readdir(dir).catch(() => []);
  const now = Date.now();
  const ready = [];
  for (const file of files.filter((name) => name.endsWith(".json") && !name.startsWith("_") && !name.startsWith("."))) {
    const item = JSON.parse(await fs.readFile(path.join(dir, file), "utf8"));
    if (new Date(item.publishAt || item.date).getTime() > now || item.draft) continue;
    ready.push({
      ...item,
      path: item.path || `/blog/${item.slug}/`,
      date: item.publishAt || item.date,
      excerpt: item.description || "",
      content: item.bodyHtml || (item.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
      featured: item.image || "",
    });
  }
  return ready;
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(path.join(root, "public"), out, { recursive: true });

const scheduled = await readScheduledPosts();
const allPosts = [...scheduled, ...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

await writeRoute("/", homePage());
await writeRoute("/services/", servicesPage());
await writeRoute("/where-to-play/", locationsPage());
await writeRoute("/colorado-locations/", mapPage({ state: "Colorado", pathName: "/colorado-locations/", mapUrl: "https://www.google.com/maps/d/embed?mid=1Zs4srDKSC776ZeYUthTA7tgp3gM&ehbc=2E312F" }));
await writeRoute("/events/search-locations-atlanta-metro-dj/", mapPage({ state: "Georgia", pathName: "/events/search-locations-atlanta-metro-dj/", mapUrl: "https://www.google.com/maps/d/u/2/embed?mid=1IlkTmsnKIURpKAcaQC3hMtHpU8E" }));
await writeRoute("/events/search-locations-oregon/", mapPage({ state: "Oregon", pathName: "/events/search-locations-oregon/", mapUrl: "https://www.google.com/maps/d/embed?mid=1XGXV248IsDJbnaM1omfftXboZfZXPBQ3&z=12" }));

for (const service of serviceData) await writeRoute(`/services/${service.slug}/`, servicePage(service));

const pageCount = Math.ceil(allPosts.length / 18);
for (let page = 1; page <= pageCount; page += 1) await writeRoute(page === 1 ? "/blog/" : `/blog/page/${page}/`, blogIndex(allPosts, page));
for (const post of allPosts) await writeRoute(post.path, blogPost(post));

const customPaths = new Set(["/", "/services/", "/blog/", "/colorado-locations/", "/events/search-locations-atlanta-metro-dj/", "/events/search-locations-oregon/"]);
for (const page of pages) if (!customPaths.has(page.path)) await writeRoute(page.path, legacyPage(page));

const staticRoutes = ["/", "/services/", "/where-to-play/", "/colorado-locations/", "/events/search-locations-atlanta-metro-dj/", "/events/search-locations-oregon/", ...serviceData.map((item) => `/services/${item.slug}/`)];
const sitemapRoutes = [...new Set([...staticRoutes, ...pages.map((page) => page.path), ...allPosts.map((post) => post.path)])];
await fs.writeFile(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapRoutes.map((route) => `<url><loc>${siteUrl}${route}</loc></url>`).join("")}</urlset>`);
await fs.writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
await fs.writeFile(path.join(out, "_redirects"), `/events/search-locations-colorado/ /colorado-locations/ 301\n/homepage/ / 301\n/client-area/ ${inquiryUrl} 302\n`);
await fs.writeFile(path.join(out, "_headers"), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n`);

console.log(`Built ${allPosts.length} posts, ${pages.length} imported pages and ${serviceData.length} service pages into dist-pages.`);

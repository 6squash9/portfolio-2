# Why the code looks like this

Every entry below explains a decision and the reasoning behind it, so that if you
ever want to change something you know what you'd be trading away.

---

## 1. The shape of the whole thing

### It's a static site

The site is built once into a folder of plain files, and a web host just hands
those files to visitors. Nothing runs on a server.

**Why:** ask what this site actually needs to do. It shows a fixed set of
information — your name, your projects, your education. None of it is different
per visitor. None of it needs a database. The one piece of live data (the GitHub
contribution graph) is fetched by the visitor's own browser.

When nothing needs computing per-request, a server is pure overhead: something to
pay for, keep running, and debug at 2am. So we don't have one.

**What this buys you:** you can host it on Netlify, Vercel, GitHub Pages, Cloudflare
Pages, or any cheap static host. Deploying is copying a folder.

### It's one page, with no navigation system

There's no router, no `/about` or `/projects` URLs. It's a single scrolling page.

**Why:** the content fits comfortably on one page, and a portfolio is something
people skim top-to-bottom in thirty seconds. Splitting it across routes would add
a routing library and force visitors to click around to see less.

If you ever add a blog, that's the point to reconsider.

---

## 2. The tools, and what each one is for

**React** builds the page out of reusable pieces ("components"). Each section —
Hero, Projects, Education — is one file that describes what it should look like.

**TypeScript** is JavaScript with labels describing what kind of value each thing
holds. Your editor then autocompletes fields and flags typos as you type, before
you ever load the page. This matters most in
[`src/data/site.ts`](src/data/site.ts), the file you'll actually edit — the types
there mean you can't misspell a field name or forget a required one without being
told immediately.

**Vite** ("veet") is the build tool. During development it serves your code and
updates the browser the instant you save. For production it bundles everything
into that static folder.

**Tailwind** is how everything is styled. Instead of writing CSS in a separate
file, you put class names like `text-lg` and `bg-white` directly on the element.

*Why utility classes rather than a stylesheet:* with a separate stylesheet, you
end up maintaining two files that have to agree with each other, and deleting a
component leaves orphaned CSS behind forever because nobody's sure what still
uses it. With utilities, the styling lives on the thing it styles. Delete the
element, the styling goes with it.

**Version pins worth knowing:** React is held at 18 and Tailwind at 3, because
that's what the libraries here are written against. Vite is on 7 specifically —
earlier major versions carry a known security issue in their development server.

---

## 3. Content is kept completely separate from layout

This is the most important structural decision in the project.

- [`src/data/site.ts`](src/data/site.ts) = **what the site says**
- `src/components/` = **how it looks**

Everything you'd realistically want to change — your name, bio, projects,
education, tech stack, links — lives in that one data file. It contains no
layout, no styling, and no logic. It's a list of facts.

**Why:** content changes constantly and layout changes rarely. If they're mixed
together, then updating your job title means editing a file full of code, and a
stray keystroke can break the page. Keeping them apart means the risky file and
the frequently-edited file are never the same file.

There's one rule that keeps this honest: **`site.ts` imports nothing.** Arrows
only point outward, from data to components. It can't accidentally start
depending on layout.

---

## 4. What loads when, and why

The site doesn't download itself all at once. It's split into pieces that arrive
in order of how much they matter.

| Piece | Size | When |
| --- | --- | --- |
| Hero + core app | 189 KB | immediately |
| Projects | 24 KB | right after |
| Contribution graph | 18 KB | right after |
| Education | 3 KB | right after |
| Animated background | **536 KB** | last, and often never |

**Why Hero is immediate:** it's what's on screen before you scroll. If it isn't in
the first download, visitors stare at an empty page.

**Why everything else waits:** you can't read the bottom of the page in the first
half-second anyway. Those sections arrive while you're still reading the top, and
you never notice the gap.

**Why the background is treated differently:** it's a live 3D graphics animation,
and it alone is larger than the entire rest of the site combined. Making everyone
wait on it before seeing your name would be a bad trade. It loads only once the
browser has finished everything that matters — and for some visitors, not at all
(see the next section).

**The build will warn you** that one chunk is over 500 KB. That's this background,
in its own separate download, which is exactly what we asked for. The warning is
confirmation the plan worked.

---

## 5. Accessibility decisions

These aren't polish. Each one is a real person being able to use the site or not.

### The animated background turns itself off for some visitors

Moving visuals trigger motion sickness, migraines and vertigo for a lot of people.
Every operating system has a "reduce motion" setting for this, and a constantly
moving full-screen animation is the textbook case it exists to stop.

So if that setting is on, we **don't download the background at all.** Not hidden
after loading — never requested. Those visitors save 536 KB and get a clean solid
background, which is a complete design on its own.

**Why this way:** hiding it after downloading would waste their bandwidth to
achieve nothing. Checking first is strictly better for everyone.

### Headings are real headings

Your name is an `<h1>`. Section titles are `<h2>`. Card titles are `<h3>`.

**Why it matters:** people using screen readers navigate a page by jumping between
headings, the same way you'd skim with your eyes. Text that's merely *styled* big
and bold is invisible to that — they'd have to listen to the entire page in order
to find anything. Search engines read structure the same way.

**Why it costs nothing visually:** Tailwind strips the browser's default heading
sizes, so an `<h1>` with our classes renders pixel-identical to a `<div>` with the
same classes. We verified this — same font size, same weight. It's free.

### Links only open new tabs when that makes sense

"Open in new tab" is applied to web links only. Email links open your mail app,
so forcing a new tab there just leaves a blank one behind.

---

## 6. How theming works, and why it's built this way

Three separate mechanisms, each solving a specific problem.

### A small script runs before the page is drawn

There's a script at the top of [`index.html`](index.html) that runs *before* the
browser paints anything. It decides dark or light and sets a class on the page.

**Why it has to be there and not in React:** React takes a moment to start up. If
the theme were decided in React, the browser would paint the default first, then
correct it — a visible white flash on a dark site. Running before first paint
means the very first thing drawn is already correct.

**The precedence:** your saved choice wins. If you've never chosen, follow the
operating system. If that can't be determined, dark.

*Why the OS gets a say:* both themes here are fully designed and look good. When
someone has told their computer they prefer light, overriding that is just
ignoring a stated preference for no reason.

### One class on the page controls every colour

Colours are defined once as variables, and everything reads from those. Flipping
the theme changes a single class on the root element; every colour on the page
follows from it.

**Why:** the alternative is every component knowing about both themes
independently, which means adding a colour somewhere means remembering to add its
dark counterpart in the same commit. With variables, there's one place to change.

### React reads the theme from the page, rather than assuming

When React starts, it checks which class the script already set.

**Why:** if React assumed a default, it would disagree with what's on screen for
anyone whose actual theme is the other one, and correct itself on the next frame.
Reading the truth off the page means React and the screen agree from the start.

### Switching themes crossfades a snapshot of the page

Clicking the toggle does this:

1. freeze all animations on the page
2. switch the theme instantly, in one step
3. have the browser crossfade a picture of "before" into a picture of "after"
4. unfreeze

**Why not just fade each element's colour, which is the obvious approach?**
Because it cannot work here, and this is worth understanding before anyone tries
to "simplify" it:

- The main column's background is a **gradient**. Browsers physically cannot fade
  a gradient — it isn't on the list of things CSS knows how to animate. It will
  always snap, instantly, no matter what you write.
- The animated background is a graphics canvas. Also can't fade.
- The contribution graph is a chart. Also can't fade.

So the obvious approach gives you some things fading and some things snapping.
When we measured a per-element approach on this page, only 113 of 794 elements
animated at all, and those used **four different durations** — so everything
finished at a different moment. That mismatch is exactly what reads as "janky".

Crossfading two snapshots sidesteps the whole problem, because blending two
pictures works identically for gradients, graphics, and charts. One clean fade of
everything at once.

**The freeze is what makes it clean:** without it, individual elements would still
be running their own animations underneath the crossfade, and you'd see both.
Hover effects are unaffected — the freeze lasts only the third of a second the
switch takes.

**Fallbacks:** browsers without snapshot support, and anyone with "reduce motion"
on, get an instant switch instead. Still better than a staggered one.

**One fragile detail:** the theme must change *between* the two snapshots. The
code uses `useLayoutEffect` rather than the more common `useEffect` because that's
the version guaranteed to run immediately rather than "soon". Swapping it to the
familiar one would quietly break the effect — the second snapshot would capture
the old theme and the fade would show nothing happening. It's the one genuinely
delicate piece of timing in the codebase.

---

## 7. Content and images

**The placeholder art is generated SVG.** The avatar and project cards are simple
shapes we drew in code rather than real photos.

*Why SVG:* it's a few hundred bytes, scales to any screen without blurring, and
adapts to the layout. Replace these with your real screenshots when you have them.

**The GitHub username must be a real account.** The contribution graph fetches
live data, so an unknown handle renders an error box instead of a graph.

**Leave [`LICENSE`](LICENSE) in place.** It's the MIT licence this project is
released under, and it carries the copyright lines that have to travel with the
code.

---

## 8. Things that look like mistakes but aren't

**Please read before "fixing" any of these.**

**`body { zoom: 90% }`** — the entire page is deliberately scaled to 90%. This is
part of how the design is tuned. Remove it and everything on the site instantly
becomes about 11% larger. It also means any measurement you take will be ~10% off
what the CSS says.

**`!important` on the text-selection colour** — normally a warning sign. Here it's
doing real work: another rule elsewhere also sets the highlight colour, and this
one is meant to win. Drop the `!important` and the colour you see when selecting
text silently changes.

**The 500 KB chunk warning at build time** — that's the animated background, in the
separate download we deliberately created for it. Working as intended.

**`fontUrl` being empty in TextPressure** — this is intentional. When it's empty the
component uses a font already loaded by the page instead of fetching its own. If
you ever swap that font, it must be a **variable font** with `wdth` and `wght`
axes — the effect works by stretching and thickening letters as your cursor
approaches, and an ordinary font silently ignores those instructions and renders
as flat static text.

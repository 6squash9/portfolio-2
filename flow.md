# How the site actually runs

A walkthrough of what happens, in order, from the moment someone opens your site
to the moment they click something.

**Two things to know upfront:**

- There is **one page** and **no server**. One HTML file, some JavaScript, done.
- Things happen in **stages.** The site shows you what matters immediately, then
  quietly fills in the rest.

---

## Stage 1 — Someone opens the site

Strict order. Each step finishes before the next begins.

```
1. Browser starts reading index.html
   │
   ├─ Sees the font links → starts fetching fonts in the background
   │
   └─ Hits a small script and STOPS to run it        ← the important bit
        This script picks dark or light:
          • Picked a theme before? Use that.
          • No? Use whatever the computer is set to.
          • Can't tell? Dark.
        Then it puts a class on the page.

        Why the browser stops here: this runs BEFORE anything is
        drawn. That's the entire point — it's why you never see a
        white flash before a dark page appears.

2. Browser creates an empty container for the app

3. The app's JavaScript loads and starts

4. React draws the page, top to bottom:

     ThemeProvider   ← tracks dark/light for the whole app
        │  First thing it does: read the class the script set in
        │  step 1. So React agrees with what's already on screen —
        │  nothing flickers or corrects itself a frame later.
        │
        └─ App
             ├─ background layer   (plain colour for now)
             │
             ├─ main column
             │    ├─ Hero                ← ready immediately
             │    ├─ ContributionGraph   ┐
             │    ├─ Projects            │ arrive a moment later
             │    ├─ Skills              │
             │    └─ Education           ┘
             │
             └─ Contact   (the floating bar at the bottom)

5. First paint — something appears on screen.
   Only Hero has real content. The other four show a grey placeholder
   that gently pulses.
```

**Why Hero is ready first:** it's what's visible before scrolling. The rest can
arrive a heartbeat later, while you're still reading the top.

---

## Stage 2 — After the page appears

Four things now happen on their own. None of them waits for the others.

### The sections fill in

Grey placeholders get swapped for real content as each section finishes arriving.

### The animated background decides whether to exist

```
Does this visitor have "reduce motion" turned on?
│
├─ YES → Stop. Do nothing, ever.
│         536 KB never downloaded. They keep the plain background,
│         which looks fine on its own.
│
└─ NO  → Wait for the browser to finish everything that matters,
          THEN fetch it.
             └─ Once here, it sets up the 3D graphics and starts
                animating.
```

Not just "loaded late" — for some visitors it is **never requested at all.**

### The contribution graph waits until you scroll near it

Lazy in two separate ways:

```
The section appears on the page
   └─ shows a grey placeholder, fetches NOTHING yet
        │
        └─ you scroll down and get close to it
             └─ NOW it goes and asks GitHub for your data
                  ├─ worked  → green squares appear
                  └─ failed  → a short message instead
                                (it won't crash the page)
```

The *code* arrives early. The *data* is only fetched if you scroll far enough to
actually see it. No point calling GitHub for someone who leaves after two seconds.

### The "SOON!" cards start following your mouse

These appear only for projects that don't have an image yet.

```
Every frame, for each letter:
   how far is the cursor from this letter?
      closer  → letter gets wider and bolder
      further → letter gets narrower and thinner
```

This works because the font is a **variable font** — one that can be smoothly
stretched and thickened, rather than having one fixed shape. An ordinary font
ignores those instructions entirely and you'd just see flat text.

---

## Stage 3 — When you click the theme toggle

The most involved path in the app, so here it is slowly.

```
You click the sun/moon button in the bottom bar
  │
  ├─ 1. FREEZE every animation on the page.
  │
  ├─ 2. Browser takes a picture of the page as it looks right now.
  │
  ├─ 3. Switch the theme instantly — no fade, no transition.
  │      Save the choice for next visit.
  │      The 3D background switches its colour here too.
  │
  ├─ 4. Browser takes a second picture of the new look.
  │
  ├─ 5. Browser CROSSFADES picture 1 into picture 2 over 0.3s.
  │      ← this is the only thing you actually see move
  │
  └─ 6. UNFREEZE. Hover effects work normally again.
```

### Why the pictures, instead of just fading the colours?

Because fading the colours cannot work here:

- the main column's background is a **gradient**, and browsers physically cannot
  fade a gradient — it isn't something CSS can animate;
- the 3D background is a graphics canvas — same problem;
- the contribution graph is a chart — same problem.

So the straightforward approach leaves some things fading and some things
snapping. When measured on this page, only 113 of 794 elements animated at all,
across **four different speeds** — everything landing at a different moment. That
mismatch is what reads as janky.

Crossfading two pictures avoids all of it, because blending two images works the
same whether the image contains a gradient, a 3D scene, or a chart.

### Proof the freeze does what it should

| Moment | A link that normally animates in 0.15s | A card that normally animates in 0.3s |
| --- | --- | --- |
| Before the click | 0.15s | 0.3s |
| **During the switch** | **frozen** | **frozen** |
| After it finishes | 0.15s | 0.3s |

Frozen only for the third of a second the switch takes. Hover effects are never
affected.

### The one delicate bit of timing

The theme has to change **between** the two pictures. Land late and picture two
captures the old look, so the crossfade shows nothing happening.

That's why the code uses `useLayoutEffect` rather than the more common
`useEffect` — it's the version guaranteed to run *right now* instead of *soon*.
This is the single place in the codebase where switching to the more familiar
option would quietly break things.

---

## Stage 4 — Where the flow is easy to break

Four places where the execution order matters more than the code suggests. If
you change one of these and something stops working, start here.

### The theme must change between the two snapshots

Covered in Stage 3, but worth repeating because it's the most fragile ordering in
the app. `toggleTheme` in
[`src/context/ThemeContext.tsx`](src/context/ThemeContext.tsx) uses
`useLayoutEffect` and `flushSync` specifically so the theme class lands
synchronously. Swap either for the more common alternative and the second
snapshot captures the old theme — the crossfade then runs but shows nothing
changing, which looks like the toggle is broken.

### The freeze and the crossfade are a pair

The `theme-switching` class in [`src/globals.css`](src/globals.css) is not
decoration. Remove it and every element resumes animating its own colours
underneath the crossfade, so you see both at once. Remove the crossfade instead
and the gradient column snaps while everything else fades. They only work
together.

### The "SOON!" effect depends on the font having variable axes

[`src/components/TextPressure.tsx`](src/components/TextPressure.tsx) writes
stretch and weight values every frame. An ordinary font ignores them **silently**
— no error, just flat static text. If you change the font in
[`index.html`](index.html), it must be a variable font carrying `wdth` and
`wght`. The component only declares its own `@font-face` when explicitly handed a
font file, so it can't shadow the page's font with a broken declaration.

### The pre-paint script and React must agree

The script in [`index.html`](index.html) sets the theme class before anything is
drawn; `ThemeProvider` then reads that class back rather than assuming a default.
If those two ever disagree — say the script's fallback changes but the provider's
doesn't — you get a visible flash on load as React corrects the screen.

### Dates are derived, not stored

[`src/components/Education.tsx`](src/components/Education.tsx) builds its date
label from year numbers, so an in-progress entry reads `2024 — 2026 (expected)`
and a finished one reads `2021 — 2023`. Replacing those numbers with a plain text
date would work today and quietly go stale the moment you graduate.

---

## Cheat sheet: what talks to what

```
index.html
  └─ the little theme script    → sets dark/light before anything is drawn
       │
       ↓ read once at startup
       │
ThemeProvider         ← single source of truth for dark/light
  ├─ reads the class the script set
  ├─ saves your choice when you toggle
  └─ toggleTheme()    ← the Contact bar's button calls this

App
  ├─ asks ThemeProvider for the current theme
  ├─ decides whether the 3D background loads at all
  └─ lays out Hero + the five sections that load later

src/data/site.ts  ──┬─→ Hero               name, bio, buttons
  (pure content,    ├─→ Projects           project cards
   no logic,        ├─→ Skills             tech stack pills
   no imports)      ├─→ Education          schools
                    ├─→ Contact            social links
                    └─→ ContributionGraph  GitHub username
```

The arrows only point **one way**, out of `site.ts`. Nothing flows back in. That's
deliberate: it's what lets you edit your details without any risk of touching how
the page is built.

# Portfolio

Personal portfolio site — React, Vite and TypeScript, styled with Tailwind.

Static build, no server. Deploys to any static host.

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run build` | Typechecks, then builds to `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run typecheck` | `tsc --noEmit` only |

## Customizing

**Everything you'd want to change lives in [`src/data/site.ts`](src/data/site.ts)**
— name, bio, projects, education, tech stack, links. It holds no layout or
styling, so you never need to open a component to update your details.

- **Images** go in `public/images/`, referenced by path from `site.ts`.
  A project with `image: null` renders the animated "SOON!" card instead.
- **Tech stack pills** are strings in `site.ts` mapped to icons in
  [`src/components/Skills.tsx`](src/components/Skills.tsx) — add to both.
- **Section headings** ("Things I've Built", "Tech Stack", "Education") are in
  their respective components.

## Structure

```
index.html            # title/meta, fonts, pre-paint theme script
src/
  main.tsx            # mounts the app
  App.tsx             # page composition
  data/site.ts        # all content
  globals.css         # Tailwind entry + CSS variables
  context/            # ThemeContext (dark/light)
  components/         # Hero, Projects, Skills, Education, Contact, ...
  components/ui/      # bento-grid, pixel-blast (WebGL background)
```

## Notes

Two documents cover the reasoning behind the code:

- **[decisions.md](decisions.md)** — why things are built the way they are, and a
  list of things that look like mistakes but are deliberate.
- **[flow.md](flow.md)** — how execution actually travels, stage by stage, and
  where the ordering is fragile.

A few highlights worth knowing before editing:

- **The WebGL background** (`components/ui/pixel-blast.tsx`) is ~536 KB, larger
  than the rest of the site combined. It's lazy-loaded on idle and skipped
  entirely for visitors with `prefers-reduced-motion` set. To drop it, delete the
  `<PixelBlast>` block in `App.tsx`.
- **Theme switching** crossfades a snapshot of the page rather than transitioning
  each element, because gradients, canvas and SVG can't be CSS-faded. The freeze
  class and the crossfade only work as a pair.
- **`body { zoom: 90% }`** in `globals.css` scales the whole page down. Removing
  it makes everything ~11% larger.

## Licence

MIT — see [LICENSE](LICENSE).

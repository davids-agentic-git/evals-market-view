# Evals Market View

A static research site on the AI evaluation market, shown under the Ascending Labs Research header. No build step: plain HTML, CSS and a little JavaScript, served by GitHub Pages.

## Pages

| Page | File | Status |
| --- | --- | --- |
| Home | `index.html` | Landing page with a card per section |
| AI Control (in brief) | `ai-control.html` | Placeholder |
| Behavior & Compliance Evals (in brief) | `behavior-compliance-evals.html` | Placeholder |
| Market Map | `market-map.html` | Market map and the list of companies we look at, embedded |
| Methodology | `methodology.html` | Two tabs (AI Control Value Levers, Evaluation Framework) |
| AI Regulation in Europe | `ai-regulation-europe.html` | Research note: summary, rules, industries, LARA and the market, appendix |

The header and footer are repeated in every page, so a nav change means editing all six files. The "in brief" icon is the `brief` span next to the two nav labels.

## Embedded views

`market-map.html` embeds two standalone documents with iframes:

- `assets/market-maps.html`: the product-cluster map, with its filters. The chip highlights (core, potential, not assessed, Tech benchmark) are read from the list's assessments, which the list keeps in the browser's local storage under `fw_v2`, and update when they change; Europe-based comes from the HQ column of the list. The map has filters for stage, scope, Value Lever and Evaluation; the list has the same filter design, with filters for cluster, stage, scope, Value Lever and Evaluation.
- `assets/companies.html`: the list of companies we look at, by product cluster, with search and filters.

They are self-contained files and also open on their own through the "full page" links. Their look (IBM Plex, warm paper, hairlines, square corners, dark mode) comes from `assets/embed.css`, which both documents link, so they match the Methodology page. `assets/market-map.css` styles the page around them. The page links the documents with a `?v=` number, and `embed.css` has its own; bump them when a document or the stylesheet changes, because GitHub Pages lets browsers cache them for 10 minutes. They are the original working documents, including the reviewer comments, per-person assessments and go-to-market flags. The only edit is the label "Tier A", renamed "Companies we look at". Notes a visitor adds in the list are saved in that visitor's own browser only. To share them, a visitor adds their name and presses "Download input (and share with David)", which saves a JSON file with only their own input, and sends the file to David. All four profiles (David, Lenny, Juan, Consu) are open to everyone. Open `assets/companies.html#admin` to also see the "Load input" button for merging files; its confirm dialog names which people's input would be replaced.

## Settings

`data/site.json`: `snapshot` is the date label in the footer, `github` is the repository URL that shows the footer link.

## Preview locally

The pages load a JSON file with `fetch`, so open them through a local server, not from the file system:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

GitHub Pages serves the `main` branch from the repository root (Settings, Pages). Every push to `main` goes live.

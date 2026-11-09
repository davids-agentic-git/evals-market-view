# Evals Market View

A static research site on the AI evaluation market, shown under the Ascending Labs Research header. No build step: plain HTML, CSS and a little JavaScript, served by GitHub Pages.

## Pages

| Page | File | Status |
| --- | --- | --- |
| Home | `index.html` | Landing page with a card per section |
| AI Control (in brief) | `ai-control.html` | Placeholder |
| Behavior & Compliance Evals (in brief) | `behavior-compliance-evals.html` | Placeholder |
| Market Map | `market-map.html` | Market maps and the list of companies we look at, embedded |
| Methodology | `methodology.html` | Two tabs (AI Control archetypes, Evaluation framework), placeholders |
| AI Regulation in Europe | `ai-regulation-europe.html` | Placeholder |

The header and footer are repeated in every page, so a nav change means editing all six files. The "in brief" icon is the `brief` span next to the two nav labels.

## Embedded views

`market-map.html` embeds two standalone documents with iframes:

- `assets/market-maps.html`: three market maps, a cluster guide and a funding table.
- `assets/companies.html`: the list of companies we look at, by product cluster, with search and filters.

They are self-contained files and also open on their own through the "full page" links. They contain no internal annotations: reviewer comments, per-person assessments and go-to-market flags were removed before publishing.

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

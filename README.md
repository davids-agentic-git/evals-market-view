# Evals Market View

A static research site on the AI evaluation market. No build step: plain HTML, CSS and a little JavaScript, served by GitHub Pages. All content is read from the JSON files in `data/`, so the site fills in as you add data. It is empty on purpose until the content is decided.

## Content files

| File | What it controls |
| --- | --- |
| `data/companies.json` | The directory page, plus the company, segment and region counts on the home page |
| `data/findings.json` | The "Key findings" cards on the home page |
| `data/site.json` | `snapshot` (the date label in the footer) and `github` (the repo URL; shows the GitHub link) |

`companies.json` is a list. Every field is optional, and a column or filter only appears when at least one company has that field:

```json
[
  {
    "name": "Example Co",
    "url": "https://example.com",
    "cluster": "Pre-release testing",
    "hq": "United States",
    "status": "Independent",
    "funding": "$12M",
    "summary": "One sentence on what it does."
  }
]
```

`findings.json`:

```json
{ "items": [ { "title": "Short claim", "body": "One or two sentences with the evidence." } ] }
```

The page text (hero, section intros, methodology) is in `index.html` and `methodology.html`.

## Preview locally

The pages load JSON with `fetch`, so open them through a local server, not from the file system:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

GitHub Pages serves the `main` branch from the repository root (Settings, Pages). Every push to `main` goes live.

# Compliance Evals for Agentic Behavior

A static research site on the AI evaluation market, shown under the Ascending Labs Research header. No build step: plain HTML, CSS and a little JavaScript, served by GitHub Pages.

## Pages

| Page | File | Status |
| --- | --- | --- |
| Market Map | `market-map.html` | Full-page view of the market map (`assets/market-maps.html`) under the site header |
| Company Assessment | `company-assessment.html` | Full-page view of the company list (`assets/companies.html`) under the site header |
| Methodology: Market Scan | `methodology-market-scan.html` | Who is in the scan, how each company was rated and checked, the logic behind the clusters, limits |
| Methodology: Value Levers | `methodology-value-levers.html` | Evaluate, Control, Govern: definitions, rulings, scoring |
| Methodology: Eval Scope | `methodology-eval-scope.html` | The four evaluation dimensions and their ratings |
| Methodology: Other Attributes | `methodology-other-attributes.html` | Audience, accountability, evaluate mode, simulation environment, object tested, benchmark |
| Insights: AI Regulation in Europe | `ai-regulation-europe.html` | Research note: summary, rules, industries, LARA and the market, appendix |
| Insights: Behavior & Compliance Evals | `behavior-compliance-evals.html` | Two tabs: rules evaluated against, and the companies |
| Redirects | `index.html`, `market-scan.html`, `methodology.html` | Not in the nav. The first two go to Market Map (`market-scan.html#assessment` and `#companies` go to Company Assessment); `methodology.html` goes to the Methodology page that holds the old tab or section in its `#hash` |

The header and footer are repeated in every page, so a nav change means editing all eight pages. The Methodology and Insights menus are `nav-group` blocks; its behaviour is in `assets/app.js`, its look in `assets/style.css`.

## Embedded views

`market-map.html` and `company-assessment.html` each show one standalone document full window, in an iframe that fills the page under the header:

- `assets/market-maps.html`: the product-cluster map, with its filters. The chip highlights (core, potential, not assessed, Tech benchmark) are read from the list's assessments, which the list keeps in the browser's local storage under `fw_v2`, and update when they change; Europe-based comes from the HQ column of the list. The map has filters for stage, scope, Value Lever and Evaluation; the list has the same filter design, with filters for cluster, stage, scope, Value Lever and Evaluation.
- `assets/companies.html`: the list of companies we look at, by product cluster, with search and filters.

They are self-contained files and also open on their own at their own address. Their look (IBM Plex, warm paper, hairlines, square corners, dark mode) comes from `assets/embed.css`, which both documents link, so they match the Methodology page. `assets/market-scan.css` makes the two pages fill the window. Each page links its document with a `?v=` number, and `embed.css` has its own; bump them when a document or the stylesheet changes, because GitHub Pages lets browsers cache them for 10 minutes. They are the original working documents, including the reviewer comments, per-person assessments and go-to-market flags. The only edit is the label "Tier A", renamed "Companies we look at". Notes a visitor adds in the list are saved in that visitor's own browser only. To share them, a visitor adds their name and presses "Download input (and share with David)", which saves a JSON file with only their own input, and sends the file to David. Both profiles (v1 Benchmark and v2 Benchmark) are open to everyone; a browser that saved the list before 18 November 2026 is renamed once (David became v1 Benchmark, Consu v2 Benchmark, and the data of Lenny and Juan moves to the local storage key `fw_v2_removed`). Every company row carries `data-added="YYYY-MM-DD"`, the day it was added to the list: the list shows it under the company name and filters on it ("Added: past x days"). Set it on every new row. Open `assets/companies.html#admin` to also see the "Load input" button for merging files; its confirm dialog names which people's input would be replaced.

## Settings

`data/site.json`: `snapshot` is the date label in the footer, `github` is the repository URL that shows the footer link.

## Password

Every page asks for a password (`assets/gate.js`). The check runs in the visitor's browser, so it keeps casual visitors out but it is not security: the repository is public and the pages are plain files, so anyone who reads the repository or a page's source can get at the content. Real protection needs a private repository and a host with server-side password protection.

The password is stored only as a salted PBKDF2 hash. To change it, run this, paste the two values over `SALT` and `HASH` at the top of `assets/gate.js`, and bump `?v=` on the `gate.js` script tags in every page and in the two embedded documents:

```bash
python -c "import hashlib, os, sys; s = os.urandom(16); print('SALT', s.hex()); print('HASH', hashlib.pbkdf2_hmac('sha256', sys.argv[1].encode(), s, 310000, 32).hex())" "new password"
```

A visitor stays unlocked in that browser (local storage key `evals-view-access`). The embedded map and list wait for the page around them; opened on their own they show the same prompt. `404.html` and the two redirect pages (`index.html` and `market-scan.html`) hold no content and are not gated.

## Preview locally

The pages load a JSON file with `fetch`, so open them through a local server, not from the file system:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

GitHub Pages serves the `main` branch from the repository root (Settings, Pages). Every push to `main` goes live.

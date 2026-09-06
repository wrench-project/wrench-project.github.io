# wrench-project.github.io

Source for [wrench-project.org](https://wrench-project.org) — the website of the
WRENCH cyberinfrastructure simulation workbench. It is a single-page Jekyll site.

## Building locally

```bash
jekyll serve      # → http://localhost:4000
```

## Layout

| Path | What it is |
|------|------------|
| `index.html` | The site. Sections: hero, `#framework`, capabilities, audiences, `#install`, `#publications` (cite), `#impact`, ecosystem, `#about`, `#community` |
| `_layouts/default.html` | Page shell |
| `_layouts/redirect.html` | Shell for the stubs in `redirects/` |
| `redirects/` | Keeps the pre-2026 URLs alive (`/install`, `/about`, `/publications`, `/usages`, `/previousreleases`, `/presentations/`) by redirecting to the matching anchor |
| `_includes/` | `head`, `nav`, `footer`, and `icon.html` (inline SVG icon set) |
| `assets/css/wrench.css` | The whole design system — one file, no framework |
| `assets/js/site.js` | All behaviour — vanilla JS, no dependencies |
| `_data/` | Content: releases, citations, team |

## Editing content

Everything that changes regularly lives in `_data/`:

- **New release** → prepend an entry to `releases.yml`. Version, date, SimGrid
  version, and notes propagate to the nav, hero, install section, and footer.
- **Someone cited WRENCH** → `citations.yml`. `type:` must be one of `Journal`,
  `Conference`, `Workshop`, `PhD Thesis`, `Report` to appear in the chart.
  `self: False` marks an external group; `usage: True` marks work that built a
  WRENCH-based simulator.
- **Team change** → `team_current.yml` / `team_previous.yml`.

Counts on the page (releases, citations, contributors) are computed from these
files. `numbers.yml` holds only the figures that cannot be derived: lines of
code and the eduWRENCH module/simulator counts.

## Notes

- Icons are inline SVG via `{% include icon.html name="github" %}` — add new ones
  to `_includes/icon.html`. There is no icon font.
- The citation chart's palette is validated for colour-vision deficiency; if you
  change it, re-check adjacent-pair separation.
- Long lists collapse to a preview behind a "Show all" button (`data-expand`),
  and expand automatically while a search or filter chip is active.
- Only the **current** release's API documentation is published under
  `/wrench/<version>/`; older versions are not hosted, and page names use
  underscores (`wrench_101.html`, `installation.html`).

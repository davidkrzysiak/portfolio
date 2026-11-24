# Engineering Portfolio: notes for Claude

David's mechanical-engineering portfolio. It's a static site with no build tools beyond PowerShell, and it opens straight from disk (file://).

## Layout
- `content.js`: site info (`SITE`: name, about, skills, experience, education, contact). Hand-edited.
- `projects/<id>/project.md`: one project per folder. Front matter (`title, date, role, tools, summary, cover, order, featured, show, gallery`) + Markdown body.
  Only top-level files in a project folder are used: images go to the inline/gallery, PDFs go to "Documents". Subfolders (`source/`, `originals/`) are ignored.
- `projects/_template/`: copy this to start a project. Folders starting with `_` are skipped.
- `tools/build.ps1`: generates `projects-data.js` (never hand-edit that file). It also converts HEIC to JPG and resizes images over 1800px (originals go to `originals/`).
- `Update Site.bat`: double-click wrapper for the build.
- `site.js`: renders index.html / project.html (`project.html?id=<id>`); it has a minimal Markdown parser (##, ###, lists, images, bold/italic, links, > quotes).
- `project-inventory.html`: private list of every project found on the computer, with folder locations. Not linked from the site.

## Rules
- To add or update a project from a folder of files, follow `.claude/skills/add-project/SKILL.md`.
- Never invent facts, numbers or outcomes. Write `TODO:` for missing info (highlighted on the site).
- Copy files into the portfolio; never move or delete the user's originals elsewhere on the computer.
- After changes, run `powershell -NoProfile -ExecutionPolicy Bypass -File tools/build.ps1`.
- Be careful with employer/lab material (Argonne) and photos of other people. Flag them for the user rather than publishing silently.

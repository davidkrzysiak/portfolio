---
name: add-project
description: Turn a folder of dumped project files (photos, PDFs, reports, slides, CAD, notes) into a portfolio entry. Use when the user says "add project X", "write up the X folder", "make an entry for X", "update the X project", or drops files into projects\<name>\ and asks Claude to process them.
---

# Add or update a portfolio project

The portfolio is a static site. Each project is a folder `projects/<id>/` with a `project.md`.
`tools/build.ps1` (run by `Update Site.bat`) turns the folders into `projects-data.js`. See CLAUDE.md for the format.

## Steps

1. **Find the folder.** The user names a folder in `projects/`, or a path elsewhere on the computer.
   If it's elsewhere, create `projects/<id>/` (lowercase, hyphens, no spaces) and **copy** (never move) the relevant files in.
   If the folder name has spaces or capitals, rename it to a clean id (ask first if it already has a project.md).

2. **Inventory everything** in the folder (recursively). Group files into: images, documents (pdf/docx/pptx/txt/md/xlsx), CAD/source (ipt, iam, prt, asm, sldprt, step, stl, f3d, catpart, gcode, ino, py, zip, ...), and other.

3. **Read the sources thoroughly.**
   - PDFs: Read tool. If a PDF won't render, say so and move on.
   - .docx / .pptx / .xlsx: unzip and pull the text out of the XML (`word/document.xml`, `ppt/slides/slide*.xml`, `xl/sharedStrings.xml`).
   - Images: look at each one. Note what it shows, so you can pick the cover, write captions and drop irrelevant ones.
   - CAD files can't be opened. Use file names, dates and folder structure as evidence (e.g. iteration count, part names).
   - `.gdoc` / `.gsheet` / `.gslides` are only links to Google, so they can't be read. Ask the user to export them as PDF into the folder.

4. **Tidy the folder** so the site only shows what's useful:
   - Leave web images (jpg/png/webp/gif/svg) and PDFs worth sharing at the top level, with clear names
     (`assembly-render.png`, `Drawing - Shift Fork.pdf`). PDFs at the top level are published as downloads.
   - Move CAD, raw data, zips, docx/pptx and anything private into a `source/` subfolder. The site ignores subfolders.
   - Leave out images that don't show the project or that show other people prominently. Tell the user which ones you left out.
   - HEIC photos and huge images are handled by the build (converted / resized, originals kept in `originals/`).

5. **Write `project.md`** using `projects/_template/project.md` as the shape:
   - Front matter: title, date, role, tools (comma list), summary (1-2 sentences for the card), cover (a file in the folder), order, featured, show.
   - Body: `## Problem` / `## Design` / `## Analysis & Testing` / `## Results` (adapt headings to the project).
     Place the best images inline with `![caption](file.png)`. Remaining images go to the auto Gallery.
   - Voice: first person, plain and specific, written for engineering recruiters. Lead with the problem, show decisions and **numbers**.
   - **Never invent facts, numbers, results or roles.** Use only what's in the sources. Where something important is unknown,
     write a short `TODO:` prompt telling the user what to add (TODOs show highlighted in yellow on the site).
   - If updating an existing project.md, keep the user's own edits; merge new information in, don't overwrite.

6. **Build:** `powershell -NoProfile -ExecutionPolicy Bypass -File tools/build.ps1` from the portfolio root. Fix any warnings it prints.

7. **Report back** briefly: what the entry says, which files you used, moved or left out, and the TODOs that need the user's input.
   Mention anything that might be sensitive to publish (e.g. lab/employer drawings, other people's photos).

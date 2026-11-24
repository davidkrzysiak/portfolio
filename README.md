# My Engineering Portfolio

A website that lives in this folder. It needs no installs and no internet. Double-click **index.html** to view it.

---

## Add a new project (the easy way)

1. Make a folder in `projects\` with a short name, no spaces: e.g. `projects\phone-toaster\`
2. **Dump everything into it:** photos, renders, screenshots, PDFs, reports, slides, CAD files, notes.
3. Open Claude Code in this portfolio folder and say:
   > add project phone-toaster

   Claude reads your files, picks the best images, writes the project page (`project.md`), files away the CAD,
   and rebuilds the site. Anything it can't know is marked **TODO** (shown highlighted in yellow on the site).
4. Refresh the browser. Fill in the TODOs.

**Without Claude:** copy `projects\_template\project.md` into your folder, fill it in,
then double-click **Update Site.bat**.

---

## Edit something

| What | Where |
|---|---|
| A project's text | `projects\<name>\project.md`, then double-click **Update Site.bat** |
| Your name, about, skills, experience, contact | `content.js` (just save and refresh, no rebuild needed) |
| Project order / hide / big card | top of `project.md`: `order: 1`, `show: no`, `featured: yes` |
| Colors | `styles.css`, change `--accent` at the top |
| Resume | save as `files\resume.pdf` |

### How a project folder works
```
projects\phone-toaster\
  project.md          ← the write-up (title, date, tools, summary + sections)
  cover.jpg           ← images here appear on the page / in the gallery
  test-results.pdf    ← PDFs here appear as downloadable "Documents"
  source\             ← subfolders are ignored by the site (CAD, raw data, drafts)
  originals\          ← full-size photos (made automatically when images are shrunk)
```
- Big photos are shrunk automatically, and iPhone **.HEIC** photos are converted to JPG.
- In `project.md`, put an image in the text with `![caption](file-name.jpg)`.
  Images you don't place yourself show up in a Gallery at the bottom.
- Folders starting with `_` (like `_template`) are skipped.

---

## Files in this folder
```
index.html, project.html   the pages (built automatically, don't edit)
content.js                 ← your info
projects\                  ← one folder per project
Update Site.bat            ← double-click after changing projects
projects-data.js           made by Update Site.bat (don't edit)
site.js, styles.css        code & styling
tools\                     build + image-resize scripts
project-inventory.html     private list of every project found on this computer (not linked from the site)
CLAUDE.md, .claude\        instructions that let Claude maintain the site
```

## Tips
- **VS Code:** File → Open Folder → `Desktop\engineering-portfolio`. The **Live Server** extension auto-refreshes the browser.
- **Putting it online later:** drag the folder onto Netlify Drop (app.netlify.com/drop) or use GitHub Pages.
  Before publishing, check you're OK sharing every PDF and image in the top level of each project folder
  (especially anything from Argonne), and delete the `originals` and `source` folders from the copy you upload.

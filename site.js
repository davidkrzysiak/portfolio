/* Builds the pages from content.js (site info) and projects-data.js (made by "Update Site.bat").
   You shouldn't need to edit this file. */
(function () {
  const PLACEHOLDER = 'images/placeholder.svg';

  if (typeof SITE === 'undefined') {
    return fail('content.js has a typo',
      'Check the last thing you edited in content.js for a missing comma, quote or bracket. VS Code underlines it in red.');
  }
  if (typeof PROJECTS === 'undefined') {
    return fail('Projects haven\'t been built yet',
      'Double-click <b>Update Site.bat</b> in the portfolio folder, then refresh this page.');
  }
  function fail(title, msg) {
    document.body.innerHTML = `<div class="error"><h2>${title}</h2><p>${msg}</p></div>`;
  }

  /* ---------- helpers ---------- */
  const visible = PROJECTS.filter((p) => p.show !== false);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const todo = (s) => String(s ?? '').replace(/\bTODO\b/g, '<mark class="todo">TODO</mark>');
  // file name inside a project folder -> usable URL
  const src = (p, f) => !f ? '' : /^(https?:|data:|\/)/.test(f) || f.includes('/') ? encodeURI(f) : `projects/${encodeURIComponent(p.id)}/${encodeURIComponent(f)}`;
  const img = (url, alt, cls = '') =>
    `<img class="${cls}" src="${url || PLACEHOLDER}" alt="${esc(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER}'">`;
  const chips = (arr) => (arr || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('');
  const paras = (t) => (t || '').trim().split(/\n\s*\n/).map((x) => `<p>${todo(x.trim())}</p>`).join('');

  /* ---------- tiny Markdown reader for project.md ----------
     ## Heading      -> new section
     ### Subheading
     - item         -> bullet list
     ![caption](file.jpg)   -> image with caption
     **bold**  *italic*  [link](url)  `code`                      */
  function inline(s, p) {
    return todo(s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${src(p, u)}" target="_blank">${t}</a>`));
  }
  function renderMarkdown(md, p, used) {
    const sections = [];
    let cur = { heading: '', blocks: [] };
    const blocks = (md || '').replace(/<!--[\s\S]*?-->/g, '').split(/\n\s*\n/);
    for (const raw of blocks) {
      const lines = raw.split('\n').filter((l) => l.trim() !== '');
      if (!lines.length) continue;
      let i = 0;
      // headings can appear at the top of a block
      while (i < lines.length && /^#{1,3}\s/.test(lines[i])) {
        const m = lines[i].match(/^(#{1,3})\s+(.*)$/);
        if (m[1].length <= 2) { if (cur.heading || cur.blocks.length) sections.push(cur); cur = { heading: m[2], blocks: [] }; }
        else cur.blocks.push(`<h3>${inline(esc(m[2]), p)}</h3>`);
        i++;
      }
      // group consecutive lines of the same kind (text, bullets, numbers, images, quotes)
      const kind = (l) => /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(l) ? 'img' : /^\s*[-*]\s+/.test(l) ? 'ul'
        : /^\s*\d+[.)]\s+/.test(l) ? 'ol' : /^\s*>/.test(l) ? 'quote' : /^###\s/.test(l) ? 'h3' : 'p';
      let group = null;
      const flush = () => {
        if (!group) return;
        const L = group.lines;
        if (group.k === 'img') {
          const figs = L.map((l) => {
            const [, cap, f] = l.match(/!\[([^\]]*)\]\(([^)]+)\)/);
            used.add(f.trim());
            return `<figure>${img(src(p, f.trim()), cap)}${cap ? `<figcaption>${inline(esc(cap), p)}</figcaption>` : ''}</figure>`;
          });
          cur.blocks.push(figs.length > 1 ? `<div class="figrow">${figs.join('')}</div>` : figs[0]);
        } else if (group.k === 'ul') {
          cur.blocks.push(`<ul>${L.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''), p)}</li>`).join('')}</ul>`);
        } else if (group.k === 'ol') {
          cur.blocks.push(`<ol>${L.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''), p)}</li>`).join('')}</ol>`);
        } else if (group.k === 'quote') {
          cur.blocks.push(`<blockquote>${inline(L.map((l) => l.replace(/^\s*>\s?/, '')).join(' '), p)}</blockquote>`);
        } else if (group.k === 'h3') {
          L.forEach((l) => cur.blocks.push(`<h3>${inline(esc(l.replace(/^###\s+/, '')), p)}</h3>`));
        } else {
          cur.blocks.push(`<p>${inline(L.join(' '), p)}</p>`);
        }
        group = null;
      };
      for (const l of lines.slice(i)) {
        const k = kind(l);
        if (!group || group.k !== k) { flush(); group = { k, lines: [] }; }
        group.lines.push(l);
      }
      flush();
    }
    if (cur.heading || cur.blocks.length) sections.push(cur);
    return sections.map((s) => `<section class="psec">${s.heading ? `<h2>${inline(esc(s.heading), p)}</h2>` : ''}${s.blocks.join('')}</section>`).join('');
  }

  /* ---------- shared bits ---------- */
  function nav(home) {
    const base = home ? '' : 'index.html';
    return `<nav class="nav"><a class="brand" href="index.html">${esc(SITE.name)}</a>
      <div><a href="${base}#projects">Projects</a><a href="${base}#about">About</a>
      <a href="${base}#contact">Contact</a>${SITE.resume ? `<a href="${SITE.resume}" target="_blank">Resume</a>` : ''}</div></nav>`;
  }
  const footer = () => `<footer class="footer"><span>&copy; ${new Date().getFullYear()} ${esc(SITE.name)}</span></footer>`;

  /* ---------- Home ---------- */
  function home() {
    document.title = `${SITE.name} | ${SITE.title}`;
    const cards = visible.map((p) => `
      <a class="card${p.featured ? ' featured' : ''}" href="project.html?id=${encodeURIComponent(p.id)}">
        ${img(src(p, p.cover), p.title)}
        <div class="card-body">
          <div class="meta">${esc(p.date)}</div>
          <h3>${esc(p.title)}</h3>
          <p>${todo(esc(p.summary))}</p>
          <div class="chips">${chips(p.tools)}</div>
        </div>
      </a>`).join('');

    const skills = (SITE.skills || []).map((s) => `<div class="skill"><h4>${s.group}</h4><div class="chips">${chips(s.items)}</div></div>`).join('');
    const exp = (SITE.experience || []).map((e) => `
      <div class="exp"><div class="exp-head"><b>${todo(e.role)}</b> &middot; ${todo(e.org)}<span class="meta">${todo(e.when)}</span></div>
      <ul>${(e.points || []).map((x) => `<li>${todo(x)}</li>`).join('')}</ul></div>`).join('');
    const edu = (SITE.education || []).map((e) => `<div class="exp"><div class="exp-head"><b>${todo(e.degree)}</b> &middot; ${todo(e.school)}<span class="meta">${todo(e.when)}</span></div></div>`).join('');
    const contact = [
      SITE.email && `<a href="mailto:${SITE.email}">${todo(SITE.email)}</a>`,
      SITE.linkedin && `<a href="${SITE.linkedin}" target="_blank">LinkedIn</a>`,
      SITE.github && `<a href="${SITE.github}" target="_blank">GitHub</a>`,
      SITE.resume && `<a href="${SITE.resume}" target="_blank">Resume (PDF)</a>`,
    ].filter(Boolean).join('');

    document.body.innerHTML = `${nav(true)}
      <header class="hero">
        ${SITE.photo ? img(SITE.photo, SITE.name, 'avatar') : ''}
        <div><h1>${esc(SITE.name)}</h1><div class="subtitle">${esc(SITE.title)}</div><p class="tagline">${todo(SITE.tagline)}</p></div>
      </header>
      <main>
        <section id="projects"><h2>Projects</h2>
          ${cards ? `<div class="grid">${cards}</div>` : '<p class="meta">No projects yet. Add a folder in projects\\ and run Update Site.bat.</p>'}</section>
        <section id="about" class="two-col">
          <div><h2>About</h2>${paras(SITE.about)}
            <h3>Experience</h3>${exp}<h3>Education</h3>${edu}</div>
          <div><h2>Skills</h2>${skills}</div>
        </section>
        <section id="contact"><h2>Contact</h2><div class="contact">${contact}</div></section>
      </main>${footer()}`;
  }

  /* ---------- Project page ---------- */
  function project() {
    const id = new URLSearchParams(location.search).get('id');
    const i = visible.findIndex((p) => p.id === id);
    const p = visible[i];
    if (!p) {
      document.body.innerHTML = `${nav(false)}<main><h1>Project not found</h1><p><a href="index.html">Back to all projects</a></p></main>`;
      return;
    }
    document.title = `${p.title} | ${SITE.name}`;
    const used = new Set([p.cover]);
    const body = renderMarkdown(p.body, p, used);
    const extra = p.gallery === false ? [] : (p.images || []).filter((f) => !used.has(f));
    const gallery = extra.length ? `<section class="psec"><h2>Gallery</h2><div class="gallery">${
      extra.map((f) => `<a href="${src(p, f)}" target="_blank">${img(src(p, f), f)}</a>`).join('')}</div></section>` : '';
    const docs = (p.files || []).length ? `<section class="psec"><h2>Documents</h2><div class="docs">${
      p.files.map((d) => `<a class="doc" href="${src(p, d.name)}" target="_blank"><span>PDF</span>${esc(d.label)}</a>`).join('')}</div></section>` : '';
    const prev = visible[i - 1], next = visible[i + 1];

    document.body.innerHTML = `${nav(false)}
      <main class="project">
        <a class="back" href="index.html#projects">&larr; All projects</a>
        <h1>${esc(p.title)}</h1>
        <div class="facts">
          ${p.date ? `<div><span>When</span>${todo(esc(p.date))}</div>` : ''}
          ${p.role ? `<div><span>Role</span>${todo(esc(p.role))}</div>` : ''}
          ${p.tools && p.tools.length ? `<div><span>Tools</span>${esc(p.tools.join(', '))}</div>` : ''}
        </div>
        <p class="lede">${todo(esc(p.summary))}</p>
        ${img(src(p, p.cover), p.title, 'cover')}
        ${body}${gallery}${docs}
        <div class="pager">
          ${prev ? `<a href="project.html?id=${encodeURIComponent(prev.id)}">&larr; ${esc(prev.title)}</a>` : '<span></span>'}
          ${next ? `<a href="project.html?id=${encodeURIComponent(next.id)}">${esc(next.title)} &rarr;</a>` : ''}
        </div>
      </main>${footer()}`;
    window.scrollTo(0, 0);
  }

  document.body.dataset.page === 'project' ? project() : home();
})();

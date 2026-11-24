/* =====================================================================
   SITE INFO: your name, about, skills, experience, contact.
   ---------------------------------------------------------------------
   PROJECTS DON'T GO HERE. Each project is a folder in projects\ with a
   project.md file. After changing a project, double-click "Update Site.bat".

   Editing tips:
   - Change text between the quotes, save (Ctrl+S), refresh the browser.
   - Every entry ends with a comma. If the page shows a red error box,
     look for a missing comma, quote or bracket near your last edit.
   - Anything marked TODO shows up highlighted in yellow on the site.
   ===================================================================== */

const SITE = {
  name: 'David Krzysiak',
  title: 'Mechanical Engineer',
  tagline: 'I design mechanisms and drivetrains, from first sketch through drawings and manufacturing. TODO: make this sentence yours.',
  photo: '',                       // e.g. 'images/me.jpg' (leave '' for none)

  about: `TODO: 2-4 sentences: where you study, your year, what you love building, and what kind of internship or role you're looking for.`,

  email: 'TODO@example.com',
  linkedin: '',                    // full URL, or '' to hide
  github: '',                      // full URL, or '' to hide
  resume: 'files/resume.pdf',      // drop your resume PDF into the files\ folder with this name

  skills: [
    { group: 'CAD',          items: ['Creo', 'SolidWorks', 'Autodesk Inventor', 'CATIA', 'Fusion 360'] },
    { group: 'Drawings',     items: ['ASME Y14.5 GD&T', 'Detail & assembly drawings', 'Design standards'] },
    { group: 'Analysis',     items: ['FEA (Inventor Nastran)', 'Gear & bearing selection', 'Experimental data analysis'] },
    { group: 'Fabrication',  items: ['3D printing (FDM)', 'Klipper firmware'] },
    { group: 'Programming',  items: ['Python', 'C++ (VEX / Arduino)', 'AI / LLM tooling'] },
  ],

  experience: [
    { role: 'SULI Intern, Physics Division', org: 'Argonne National Laboratory', when: 'Summer 2026',
      points: [
        'Built an AI drawing-checker app that reviews engineering drawings against the division design standard and returns a marked-up PDF',
        'Designed and drew parts for the Canadian Penning Trap and a cryogenic gas target. TODO: confirm and add details',
      ] },
    { role: 'College Bound Intern, Physics Division', org: 'Argonne National Laboratory', when: 'Summer 2025',
      points: [
        'Produced detail and assembly drawings for Canadian Penning Trap (CPT) hardware',
        'Designed shop fixtures and small parts (PCB drill template, tracker base, Gammasphere screw cover). TODO: confirm',
      ] },
    { role: 'Drivetrain Designer', org: 'Off-Road Illini Baja SAE', when: '2025 - present',
      points: [
        'Designed a dog-clutch gearbox, shift fork and case components for the 2025-26 car',
        'Designing the 2026-27 gearbox. TODO: your scope and results',
      ] },
  ],

  education: [
    { school: 'TODO: University (Off-Road Illini is the UIUC team, so is it University of Illinois Urbana-Champaign?)', degree: 'B.S. Mechanical Engineering', when: 'TODO: expected graduation' },
  ],
};

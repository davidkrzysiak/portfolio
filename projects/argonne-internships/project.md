---
title: Argonne National Laboratory: AI Drawing Checker & Physics Hardware
date: Summer 2025 & Summer 2026
role: College Bound Intern (2025), SULI Intern (2026), Physics Division
tools: Python, AI / LLMs, Autodesk Inventor, ASME Y14.5 GD&T, SolidWorks
summary: Two summers in Argonne's Physics Division. I made production drawings for Canadian Penning Trap hardware, then built an AI tool that reviews engineering drawings against the division's design standard and marks up the problems.
cover:
order: 2
featured: no
show: yes
---

## Overview

I've spent two summers with the Physics Division engineering group at Argonne National Laboratory. In 2025, through the College Bound internship, I made detail and assembly drawings for experimental hardware. In 2026, as a DOE SULI intern, I turned what I'd learned about drawing review into software.

<!-- Images are in private\ (kept off GitHub until your mentor approves).
     To publish one: move it up into this folder and add it back, e.g.
     ![At Argonne with my mentor](argonne-with-mentor.jpg)
     Others: argonne-lab.jpg, drawing-checker-output.png (good cover), step-to-drawing-output.png -->

## The Problem: Drawing Review Doesn't Scale

The division had hundreds of legacy drawings with inconsistent conventions. Many of the design rules lived in people's heads instead of in a written standard. Manual drawing review was slow, error-prone and hard to repeat.

## Drawing Parser → A Written Design Standard

I first wrote Python tooling that ingests a large set of existing drawings and uses AI to extract their dimensions, symbols, annotations and title-block conventions. The extracted data was then normalized and combined into a single documented **engineering design standard** for the division. That standard is backed by real data from existing drawings, not guesswork. I presented this work to the division as *"Parsing Drawings with AI: Building an Engineering Design Standard from Code + AI."*

## Drawing Checker: An AI Review Panel

Next I built **Drawing Checker**, a desktop app (packaged as a single .exe so colleagues don't need Python). You give it a drawing PDF and the standard, and a panel of AI agents reviews it:

1. An **interpreter** (vision model) reads the sheet from high-resolution tiles and writes a factual description.
2. Four **specialists** (reasoning model) each check one area against the standard: holes & features, dimensioning & placement, views & projection, and title block, material and GD&T.
3. A **referee** reviews every finding and drops the weak or wrong ones.

The output is a new PDF with numbered, severity-colored pins on each problem, plus a summary page listing the rule, the issue and the fix. It runs through Argonne's internal AI gateway, so models can be swapped from a dropdown for comparison, and it reports token usage for every run.

I also experimented with generating drawings directly from STEP files, including suggested GD&T callouts.

## Hardware & Drawings

Alongside the software, I produced drawings and designs for lab hardware, including:

- **Canadian Penning Trap (CPT):** detail drawings for sample-wheel parts, sensor baseplate, bias-wheel mount, platform supports and gussets, TOF electrodes, and the Lorentz steerer
- **Cryogenic gas target:** gas-cell body and exit window revisions, target support
- **Shop & lab fixtures:** conflat flange holder, PCB drill template, Gammasphere screw cover, tracker base

TODO: Pick 1-2 of these to describe properly. What was the part for, what constraints (vacuum? cryo? materials?), and what happened to it (machined? installed?). Also confirm which year each one was.

## Impact

TODO: Any concrete results? E.g. "review time went from X to Y", "N drawings checked", "adopted by the group". The presentation claims drawing review went from days to minutes. Only keep that if you can back it up.

# Forge Watch Collection — Galaxy Watch 8

## Non-negotiable design rules
- Ten genuinely different concepts, not one template recolored or rearranged.
- Every face has a purpose-built Always-On Display (AOD).
- Every AOD remains recognizably paired with its active face while removing seconds/animation and reducing OLED pixel load.
- Large usable touch/complication targets.
- Original FORGE branding and original geometry/assets.

## 1 — FORGE SOVEREIGN — formal luxury analog
Traditional black enamel-style dress dial. FORGE wordmark under 12. Applied warm-metal baton indices, dauphine-inspired original hands, framed date at 3, fine railroad minute track. Almost no digital information. This is the suit-and-tie face.
AOD: black field, outline hands, 12/3/6/9 markers, date and FORGE only.

## 2 — FORGE REGULATOR — mechanical instrument analog
Completely different time architecture: giant central minute hand, separate hour subdial at 12 and running-seconds subdial at 6. Industrial precision typography, brushed dark dial, exposed scale markings. Battery shown as a tiny power-reserve gauge at 9.
AOD: central minute hand + hour subdial + sparse scale; seconds and battery gauge disappear.

## 3 — FORGE PILOT — aviation analog
High-legibility pilot watch: oversized luminous Arabic numerals, triangle at 12, broad sword hands, outer minute scale and day/date window. Matte near-black dial with one configurable accent. Designed to read instantly rather than look dressy.
AOD: skeletonized large numerals at 12/3/6/9 plus luminous-style hour/minute hands.

## 4 — FORGE CHRONO — motorsport chronograph analog
Tachymeter-inspired outer graphic, three distinct subdials used for useful watch data rather than pretending to be a mechanical stopwatch: steps progress, battery and day/date. Strong redline accent and perforated-dashboard visual language. FORGE centered below 12.
AOD: hour/minute hands, outer cardinal ticks, FORGE and tiny battery state; subdials collapse.

## 5 — FORGE ARCHITECT — ultra-modern analog
No traditional numeral ring. Four architectural cardinal blocks, floating thin hands, asymmetric date placement, negative space and subtle construction-grid geometry. Monochrome concrete/graphite aesthetic. Optional next-event complication integrated as a lower text line.
AOD: only four cardinal blocks, hands and FORGE — extremely minimal.

## 6 — FORGE FLIP — split-flap digital
Time presented as four large split-flap/airport-board cards. Date appears as a narrow departure-board strip. Steps use a row of tiny illuminated blocks along the bottom. Palette choices affect card accents, not the whole layout.
AOD: hollow HH:MM flap outlines and a tiny FORGE mark; step animation and decorative cards off.

## 7 — FORGE ORBIT — radial digital
No rectangular clock layout. HH:MM sits compactly in the center while concentric arcs encode steps, step goal, battery and day progress. Tapping each ring opens its complication. Bright configurable neon accents against black.
AOD: center time plus one thin step-goal orbit and FORGE; all secondary arcs disappear.

## 8 — FORGE TERMINAL — retro-future data digital
Monospaced command-terminal aesthetic. Large time at upper left, FORGE // SYSTEM at top, steps rendered as a numeric counter and progress bar, battery as BAT 082%, date as ISO-style line, two customizable data rows. Amber, phosphor green, ice blue, white and magenta themes.
AOD: time + one-line date + FORGE prompt, dim monochrome.

## 9 — FORGE MOSAIC — playful modular digital
A deliberately graphic face made from irregular rounded cells rather than a conventional dial. One huge cell holds hours, another minutes, a circular cell shows step progress, smaller cells hold battery/date/two complications. Multiple curated fun palettes where cells use different complementary colors.
AOD: black background with only outlined hour/minute cells and a small steps number.

## 10 — FORGE HORIZON — landscape/activity digital
Time floats above a stylized horizon line. Step progress physically advances a small marker from left to right across the horizon during the day. Sunrise/sunset or day-progress complication can influence the arc above it. Battery is a tiny vertical gauge at the edge; date sits beneath the time. Calm color families: dawn, daylight, sunset, aurora, night.
AOD: black field, thin horizon, white time, static progress marker and FORGE.

## Interaction / AOD engineering baseline
- Reference canvas: 450 x 450 round display; safe-zone aware.
- Primary interactive regions target roughly 100–130 px wherever layout permits.
- Complication slots are visually integrated rather than pasted on top of the design.
- AOD disables seconds and animation and removes decorative filled areas.
- AOD time remains immediately readable on all ten faces.
- AOD retains enough signature geometry that each face is still visually distinct while ambient.

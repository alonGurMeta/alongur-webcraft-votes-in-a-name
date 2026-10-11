# Votes in a Name — Product Requirements Document

## 1. Product Overview

- `Votes in a name` is a single-page interactive data story about confusingly similar candidate names in Indian elections and how such namesakes can be found in election records.
- The product opens with a cinematic scroll-driven narrative that places the reader at a polling booth, then unfolds into an editorial article with hand-drawn artwork and five interactive data modules: a candidate-pool diagram, an algorithm score comparison, a state-by-state similarity chart, a name-comparison lab with generated face cards, a name-change pattern explorer, and a vote-share chart, closing with a table of close elections and a sourced footer.
- The core experience is reading, scrolling, and playing: the reader follows the story, manipulates names and filters inside the visual modules, and arrives at the closing evidence with an intuition for how a near-identical name can sway a tight race.
- Primary product qualities are editorial, illustrative, data-heavy, and playful, with a warm paper palette, compact editorial typography, bold section headings, and scroll-reveal motion throughout.

## 2. Audience and Core Experience

- Primary audience:
  - Curious general readers interested in elections, data stories, and visual explainers.
  - Readers with no background in record-matching or statistics; every method is introduced through pictures and play before numbers appear.
- Main user goals:
  - Follow a short election-day story and understand why similar names matter.
  - Compare name-matching approaches visually and try them on any two names.
  - Browse recurring namesake patterns by state and see close elections where namesakes may have mattered.
- Core user flows:
  - Scroll the opening journey from polling-booth scene through the namesake reveal to the corpus scale.
  - Read the article top to bottom, interacting with each visual module in place.
  - Type two names into the comparison lab, or load a random election pair, and read the resulting similarity and face cards.
  - Pick a state in the pattern explorer and hover dots and chart marks to inspect candidate pairs.
  - Scan the closing results table for the tightest margins and highest similarities.
- Important emotional and usability qualities:
  - Warm, hand-drawn, and wry rather than academic; the tone stays curious and lightly humorous.
  - Every interaction gives immediate visible feedback; nothing requires an account, a submission, or waiting.
  - Motion delights but never gates content: with reduced motion, all content appears directly.

## 3. Global Design System

- Typography:
  - Body and chart text use `Asap` (regular with italic support) at a `15px` root size, stepping to `16px` at `32rem` and `18px` at `48rem`, with body line height around `1.6`–`1.85`.
  - Devanagari display text uses `Alkatra`.
  - Section headings (`h2`) render around `1.75rem` (`2.25rem` at `32rem`, `2.5rem` at `48rem`) in the deep-red accent; sub-headings (`h4`) render around `1.25rem`–`1.5rem` in the same accent.
  - Chart and table labels use small uppercase treatments with wide tracking (roughly `0.05em`–`0.15em`).
- Color tokens and usage:
  - `--paper` `#ffffff` page background; `--ink` `#211f17` body text and hard shadows.
  - `--red` `#c3362c` title panel and key accents; `--coral` `#ff7d69` title frame.
  - `--accent` `#b44e2f` section headings, chart bars, and highlight fills.
  - `--yellow` `#efc84b` lab panel background.
  - Cream `#ececf1` / `#fff5e4` text on the title panel; pale card `#ececf1`-like fill with dark border for story cards; heat reds from pale blush to `#e04b2f` / `#e35b38` for score cells and margin cells.
  - Focus ring teal `#247669` at `3px` with `3px` offset on all interactive elements.
- Spacing, layout grid, radii, borders, shadows, elevation:
  - Article prose column caps at `40rem` centered; visual modules span wider (`720px`–`1050px`) centered.
  - Radii around `4px`–`12px` (`8px` story cards, `12px` title frame); hard offset shadows (for example `9px 9px 0 #222` on the lab panel, `2px 2px 0 #222` on small toggle buttons) give the tactile paper feel.
  - Borders are thin dark rules on cards, tables, and panels; table headers sit on a warm gray fill.
- Shared product/UI patterns:
  - Story card: pale fill, dark `1px` border, `8px` radius, inset shade plus hard drop shadow.
  - Title card: coral outer frame with deep-red inner panel and cream display type.
  - Data table: uppercase small header row, zebra-free rows with hairline dividers, horizontally scrollable wrapper on narrow screens.
  - Tooltip card: small floating panel showing a title, name pair, and scored values near the pointer.
  - Toggle button and legend chips: pill or small rectangular buttons with a clear selected state.
- Motion language and timing:
  - Scroll-reveal sections fade and rise (`~0.8s`) into place as they enter the viewport.
  - The opening scene crossfades artwork (`~0.5s`); story cards dim to `0.2` opacity until active.
  - Clouds drift continuously across the opening sky at staggered slow durations.
  - Card-grid sequences use eased shuffles and flips; chart tooltips follow the pointer.
- Global responsive system:
  - Breakpoints at `680px`, `768px`, `32rem`, and `48rem`; gutters stay at `1rem` page padding on small screens.
  - Touch targets for grid cells, legend chips, lab controls, and inputs are at least `44px` in the active dimension.
  - Tables and wide charts scroll horizontally within their wrappers instead of overflowing the page; no horizontal page overflow at `320px`.
- Image and media treatment:
  - Hand-drawn illustration style throughout; hero and break art centered at up to `28rem` wide.
  - Scene artwork fills the viewport width and anchors centrally; portrait and crowd artwork is decorative with meaningful alternatives only where the product requires it.
  - Generated face cards render square (`40px` in table cells, larger in the lab) layered from the face-art set.

## 4. Global Accessibility Requirements

- All interactive controls (toggles, inputs, random-pair button, legend chips, state tiles, table scroll regions, charts with hover detail) are reachable and operable by keyboard, with `Enter`/`Space` activating tile and chip controls.
- Every focused control shows the visible teal focus ring; focus is never suppressed.
- Heading order is logical: one top-level title, `h2` section headings, `h3`/`h4` module and footer sub-headings.
- Landmarks use header, main, article, section, figure, table, and footer semantics; decorative canvases and crowd strips are hidden from assistive technology while their data is available in adjacent text or labelled summaries.
- Controls carry accessible names: inputs have screen-reader labels (`First name`, `Second name`), icon-only toggles expose their purpose, charts expose text summaries of what they show, and the state tile map exposes each state name.
- Meaningful imagery (poster wall, break art, award badge, voting-machine portrait panel) carries descriptive alternative text; drifting clouds and crowd decoration are hidden as decorative.
- Text and control contrast meets friendly levels: body ink on paper, cream on deep red, white on heat-red fills only at depths that preserve legibility.
- With reduced motion enabled, all animation and transitions are disabled and revealed content appears in its final state.
- Dynamic states are perceivable without color alone: selected legend chips, selected state tiles, heat cells with white text at high depths, and lab metric values as text percentages alongside face changes.

## 5. Global Content and Data

- Product name spelling is `Votes in a name` with the subtitle `Namesakes in Indian Elections and How to Find Them`.
- Voice and tone are editorial and wry, second-person in the opening journey, explanatory in method sections, and careful about causality in the closing (namesakes *may* have mattered; coincidence is possible).
- Repeated labels and controls:
  - `presents`, `Read more at`, `compared to`, `Or choose a random pair from an election ↻`.
  - Metric labels `BI-SIM`, `Dice`, `JW`, `Total Similarity`; footnote `¹ JW = Jaro-Winkler, BI-SIM = BI-SIM (Kondrak, 2003), Dice = Dice Coefficient`.
  - Corpus-count toggle showing `3.5 lakh ⇄` and switching to `350,000 ⇄`.
- Number formatting: Indian-format toggle for the headline corpus count; vote counts with thousands separators; margins with thousands separators; similarities as percentages with one decimal in tables and the lab; chart tooltip scores with three decimals.
- Shared asset-to-content mapping (detail per surface in Product Surfaces):
  - Opening scenes: `/assets/outside-1.CR7Dnvz8.webp`, `/assets/school-1.CftLUXgV.webp`, `/assets/rahul-1.G6UMmSJ3.webp`; drifting clouds `/assets/cloud-1.C1ayEgNb.webp`, `/assets/cloud-2.BXvvrTef.webp`, `/assets/cloud-3.webp`.
  - Article art: `/assets/posters.BxzP8ep4.png`, `/assets/break-1.DJxeRFio.png`.
  - Identity: `/assets/logo.CsOc2COw.png` (masthead and footer).
  - Lab: `/assets/evm.D55slFqv.png` voting-machine art; face layers under `/assets/face-gen/`.
  - Crowd strips: `/assets/crowd/` portraits; card faces: `/assets/reference/chandhu-sprites.png`.
  - Award: `/assets/a-win.rNYIlb2F.webp`.
  - Type: `/assets/asap-latin-wght-normal.DwNFbAQw.woff2`, `/assets/asap-latin-wght-italic.D03uPo4x.woff2`, `/assets/alkatra-devanagari-wght-normal.CUq3eY5e.woff2`.

## 6. Product Surfaces

### Opening Journey

- Purpose:
  - Place the reader at an election in Wayanad, Kerala and build the namesake puzzle step by step.
  - Motivate the rest of the article before any method or number appears.

#### Sticky Scene and Story Cards

- Content:
  - Nine narrative steps, in order:
    1. `We begin in Wayanad, Kerala. It is voting day.`
    2. `You step into the voting booth. The electronic voting machine hums in the converted classroom as the fan whirs overhead. Other voters behind you wait their turn. Your eyes search for the familiar symbol and name amid the rows of text.`
    3. The Gandhi ballot: familiar `Rahul Gandhi`, then another `Raghul Gandhi` with a different symbol, another man with the Gandhi last name, and one more `Rahul Gandhi KE`.
    4. `In that election, 2,196 voters chose` `Rahul Gandhi KE` — `a candidate whose campaign began at the last moment and political aspirations ended right after the polls. Whether these votes were because of confusion for the other Rahul Gandhi, or real conviction, is unclear.`
    5. `In 2014, before photos of the candidates were put on EVMs, voters of a constituency in Chhattisgarh were faced with the choice of BJP candidate` `Chandu Lal Sahu` `and 11 other` `Chandu Lal Sahu` `s. All spelt almost the same. Symbols, names, but no photos.`
    6. `There is one real` `Chandu Lal Sahu` `in here…`
    7. `…did you keep track of him?`
    8. `The real` `Chandu` `still won, but would have gotten at least 30,000 more votes without his duplicates in the running.`
    9. `This doesn't just happen to a single party. Between 1960 and 2024, there are over 8,000 candidates who share very similar names with their rivals — close enough to give careful voters pause, and perhaps misdirect the less aware into voting for namesakes who would disappear after election day.`
  - Reference names carry a green check-chip style; namesake names carry a gray pawn-chip style.
- Structure, components, and assets:
  - Full-viewport sticky scene behind a column of nine story cards; the active card is fully opaque while others dim.
  - Illustrated backdrops `/assets/outside-1.CR7Dnvz8.webp`, `/assets/school-1.CftLUXgV.webp`, and `/assets/rahul-1.G6UMmSJ3.webp` fade in for the first three steps.
  - Three drifting cloud images cross the sky during the first step; an animated voter crowd lines the scene at the first and fourth steps.
  - From the sixth step, a 12-card memory grid (four columns by three rows) appears in the scene: card backs face the reader, one card is the real `Chandu Lal Sahu` and eleven are near-identical namesakes from `/assets/reference/chandhu-sprites.png`.
- Behavior / states:
  - Scrolling activates each step: artwork crossfades, cards highlight, and the memory grid animates.
  - When the tracking step is displayed, the grid performs three visible shuffles; when the reveal step arrives, all cards flip to show faces.
  - The closing scale step settles the scene on the corpus claim of over `8,000` similar-name candidates.
- Responsive behavior:
  - On narrow screens the scene artwork widens beyond the viewport and stays centered while story cards keep full readability.
  - The card grid shrinks to fit without page overflow.
- Accessibility notes:
  - The scene is decorative and hidden from assistive technology; the story text carries the narrative.
  - Reduced motion shows each step's final state without crossfade, drift, shuffle, or flip animation.

### Masthead

- Purpose:
  - Establish the publication brand, title, and authorship before the article begins.
  - Set the coral and deep-red visual signature for the whole piece.

#### Title Card

- Content:
  - Publisher logo with link text equivalent `Diagram Chasing`, overline `presents`.
  - Devanagari overline `✦ नाम तो सुना ही होगा ✦`, title `Votes in a name`, subtitle `Namesakes in Indian Elections and How to Find Them`.
  - Byline `By` `Aman Bhargava` and `Art by` `Reechik Banerjee`, each name linked to its author page.
- Structure, components, and assets:
  - Centered column: logo (`/assets/logo.CsOc2COw.png`, `176px` wide with soft drop shadow), italic `presents`, coral-framed deep-red title panel with cream display type, then the byline.
  - The title is oversized uppercase with a layered paper-shadow offset in cream over ink.
- Behavior / states:
  - Author and logo links open their destinations in a new tab; no other interaction.
- Responsive behavior:
  - The title scales with the viewport and stays fully visible at mobile widths.
- Accessibility notes:
  - The logo image carries its publication name as alternative text; heading order starts at the `h1` title.

### Article Body and Editorial Art

- Purpose:
  - Tell the election-symbols backstory, introduce the namesake examples, and carry the reader between visual modules.
  - Keep a consistent narrow reading measure with full-width art and crowd beats.

#### Intro and Poster Wall

- Content:
  - Opening paragraphs on India's rolling elections, electorates across `28 states`, party symbols (`INC's hand`, `BJP's lotus`, `AAP's broom`), independents choosing from approved symbols such as pressure cookers or ceiling fans, and the blind spot: symbols cannot repeat but names nearly can.
  - Namesake roll call: `Alimineti Uma Madhava Reddy` against `Alimineti Madhava Reddy`, `Raghubir Singh` with `Raghvir Singh`, `H.D. Kumaraswamy` with `D. Kumaraswamy`, `S.V. Ramani` with `S. Veeramani`, `Virender Singh` with `Virandar Singh`, and `Mohan Lal Badoli` with a more ambiguous `Mohan Lal`.
  - Corpus claim with toggle: approximately `3.5 lakh ⇄` individual names (`350,000 ⇄` when toggled) examined between `1960` and `2023` across general and state elections.
- Structure, components, and assets:
  - Narrow prose column with the wide poster-wall figure `/assets/posters.BxzP8ep4.png` (`A hand-drawn wall of election posters bearing similar candidate names`).
  - Count toggle styled as a small dark button inline in the sentence.
  - Full-bleed animated crowd strip (`/assets/crowd/` portraits) breaking the column after the roll call.
- Behavior / states:
  - Selecting the count toggle swaps `3.5 lakh ⇄` and `350,000 ⇄` immediately with no other change.
  - Prose sections fade and rise into view on scroll.
- Responsive behavior:
  - The crowd strip spans the full viewport width at all sizes without causing page overflow.
- Accessibility notes:
  - The poster art carries its descriptive alternative text; the crowd strip is decorative.
  - The toggle is a real button with a visible focus ring and an immediate text change.

#### Method Bridges and Break Art

- Content:
  - `Name games` section on why the visible Gandhi case matters less than small-constituency unknowns, and how voters match a heard name to a written name at the machine.
  - Method bridge copy: look-alike versus sound-alike comparison, the four approaches (edit counts, letter-pair comparison, ordered similarity, sequential pairs with word order), the ensemble rule (a pair counts as similar only when at least two approaches agree), and the note that values show three decimals because `0.754` versus `0.775` matters here.
  - `We're not that different, you and I` section leading into the lab, including the struck-through joke `$50 cash prize`.
  - `So what changed between us?` section on recurring namesake forms, first-name versus last-name variation, and the Punjab-versus–Tamil Nadu contrast.
  - `Does it ever make a difference?` section on sub-one-percent namesake vote shares and whether small shares can matter.
  - Simulation bridge: `400` simulations per pair moving `20%`, `40%`, `60%`, and other portions of namesake votes, weighted by matching scores, surfacing races favoring the similar-named candidate at least half the time.
- Structure, components, and assets:
  - Narrow prose with the mid-article break figure `/assets/break-1.DJxeRFio.png` (`Hand-drawn people peeking into the data`).
- Behavior / states:
  - Sections reveal on scroll; no controls in these blocks.
- Accessibility notes:
  - The struck-through prize joke uses real deletion semantics so assistive technology perceives the humor as struck text.

### Candidate Pools Diagram

- Purpose:
  - Show how candidates were divided into the two analysis groups before similarity scoring.
  - Give the reader the corpus construction at a glance.

#### Pool Bubbles

- Content:
  - Left group label `National or state party candidates`; right group label `Independent, candidates with <5% vote share or first time running`.
- Structure, components, and assets:
  - Wide figure with two bubble clusters: five large solid dots on the left, twelve smaller lined dots on the right, each group captioned beneath.
- Behavior / states:
  - Static diagram with scroll reveal; no controls.
- Responsive behavior:
  - The diagram scales down proportionally and stays fully visible on narrow screens.
- Accessibility notes:
  - The figure exposes a text summary of the two analysis pools so the grouping survives without vision.

### Scoring Comparison Table

- Purpose:
  - Show how the three scoring approaches disagree on real name pairs.
  - Motivate the ensemble rule with concrete numbers.

#### Differences in Scoring

- Content:
  - Heading `Differences in scoring` and six rows:

| State | Reference name | Similar name | JW | BI-SIM | Dice |
|---|---|---|---|---|---|
| Assam | Prodip Hazarika | Pradip Hazarika | `81.3%` | `86.7%` | `85.7%` |
| Bihar | Devandra Prasad Yadav | Devendra Prasad Yadav | `83.5%` | `90.5%` | `80.0%` |
| Gujarat | Rajeshbhai Chimanbhai Vasava | Ramanbhai Chimanbhai Vasava | `77.0%` | `82.1%` | `64.2%` |
| Madhya Pradesh | Mahendra Singh Bhadoriya | Devendra Singh Bhadoriya | `75.0%` | `81.2%` | `87.0%` |
| Tamil Nadu | Nageswari Thirumathi N. | Maheswari Thirumathi A. | `76.9%` | `84.1%` | `66.7%` |
| Uttar Pradesh | Dr. Narendra Kumar Singh Gaur | Narendra Kumar Singh Yadava | `70.8%` | `78.6%` | `71.7%` |

  - Footnote `¹ JW = Jaro-Winkler, BI-SIM = BI-SIM (Kondrak, 2003), Dice = Dice Coefficient`.
- Structure, components, and assets:
  - Card-style table: dark uppercase header row, hairline dividers, heat tint deepening with higher scores, wrapped in a horizontal scroll region.
- Behavior / states:
  - Static values with scroll reveal; on narrow screens the table scrolls horizontally within its card.
- Responsive behavior:
  - The row keeps a minimum readable width and scrolls inside the card instead of overflowing the page.
- Accessibility notes:
  - Real table headers label every column; scores are text, never color alone.

### Similarity Barcode Chart

- Purpose:
  - Show what each approach captures across states and how state name pools differ.
  - Let readers isolate one approach and inspect individual pairs.

#### Barcode Plot

- Content:
  - Horizontal axis from `0.5` to `1.0` with end labels `← LESS SIMILARITY` and `MORE SIMILARITY →`; one row per state; tick labels `0.5`–`1.0`.
  - Legend chips `BI-SIM`, `Dice Coefficient`, `Jaro-Winkler` with series colors (green, lavender, peach).
- Structure, components, and assets:
  - Wide bordered panel with the legend centered above a full-width chart; each detected pair is one short vertical tick colored by approach.
- Behavior / states:
  - Selecting a legend chip isolates that single series; selecting the isolated chip again restores all three.
  - Hovering or focusing a tick opens a tooltip with the state, the compared pair with parties, and all three scores to three decimals.
  - The chart redraws on resize, stacking taller with centered state labels on narrow screens.
- Responsive behavior:
  - The panel keeps full width; state labels move above their rows and the plot grows taller on mobile.
- Accessibility notes:
  - Legend chips are real toggle buttons with selected styling plus text state.
  - The chart exposes a text summary of the similarity-by-state distribution; tooltips are pointer and keyboard reachable.

### Name Comparison Lab

- Purpose:
  - Let the reader feel visual similarity by typing any two names and watching scores and face cards respond.
  - Translate abstract scores back into visible difference.

#### Lab Panel

- Content:
  - Heading `Enter any two names`, subheading `...and see what your face cards look like`, action `Or choose a random pair from an election ↻`.
  - Two text fields (defaults `Raghubir Singh` and `Raghvir Singh`) joined by `compared to`.
  - Metric readouts `BI-SIM`, `Dice`, `JW`, `Total Similarity` as live percentages.
- Structure, components, and assets:
  - Yellow card panel with a hard offset shadow; stacked heading row, three-column input row, voting-machine portrait panel (`/assets/evm.D55slFqv.png`, `Electronic voting machine`) holding two generated face cards with their typed names beneath, and a four-cell metric row.
  - Faces are layered from `/assets/face-gen/` art; near-identical names produce near-identical faces.
- Behavior / states:
  - Typing recomputes all four metrics and both faces immediately; empty input shows `—` as the name.
  - The random-pair action loads a real election pair from the 500-pair sample set.
  - When total similarity drops below roughly one third, the second face visibly diverges from the first instead of tracking it.
  - Scores also reflect shared letter pairs behind the scenes, surfaced through the face resemblance rather than raw pair lists.
- Responsive behavior:
  - Inputs stack vertically on narrow screens; face cards shrink while staying legible; the metric row keeps four readable cells.
- Accessibility notes:
  - Each input has a screen-reader label; the portrait panel exposes a text summary of the generated pair.
  - Metric changes are plain text so they survive without perceiving the faces.

### Name-Change Pattern Explorer

- Purpose:
  - Reveal the recurring structural forms namesake pairs take and how they distribute across states.
  - Connect the state view back to individual candidate pairs.

#### Bubble Clusters and State Tile Map

- Content:
  - Eight pattern clusters: `Removed initials`, `Middle name modified`, `First name only`, `Name removed`, `Both names changed`, `Name added`, `Last name only`, `Added initials`, each labelled with its pair count.
  - State tile map of India with two-letter codes and per-state pair-count bars plus the selected state name.
  - Caption `Each dot is one candidate pair. Showing` N `pairs from` STATE `in full color.`
- Structure, components, and assets:
  - Wide section pairing the bubble field with the tile map (map above the field on mobile, beside it on desktop); hover tooltips float near the pointer.
- Behavior / states:
  - Selecting a state tile highlights that state's dots in full color and dims the rest; the caption count and state name update.
  - Hovering a highlighted dot opens a tooltip with the pattern chip, state, compared pair, and similarity to three decimals.
  - Tiles and legend states persist while scrolling within the section.
- Responsive behavior:
  - The tile map moves above the bubble field on narrow screens at a capped width; dots and labels scale down without page overflow.
- Accessibility notes:
  - Tiles are real buttons with state names exposed; selection is shown by style plus the caption text, not color alone.
  - The field exposes a text summary naming the selected state and its pair count.

### Vote-Share Chart

- Purpose:
  - Show that most namesake candidates earn tiny vote shares — and set up why even a small share can matter.
  - Bridge the pattern analysis to the closing election evidence.

#### Namesake Share Histogram

- Content:
  - Horizontal axis `Vote Share (%)` with tick labels `0.0`–`20.0`; vertical axis of race counts in thousands.
  - First-bar annotation `Namesake candidates`.
- Structure, components, and assets:
  - Compact centered chart with deep-red bars on a plain panel and scroll reveal.
- Behavior / states:
  - Static distribution with scroll reveal; no controls.
- Responsive behavior:
  - The chart scales to its container and stays legible on narrow screens.
- Accessibility notes:
  - The figure exposes a text summary of the namesake vote-share distribution.

### Closing Evidence Table

- Purpose:
  - Name the close races where similar-name pairs coincide with tight margins.
  - End the story on verifiable cases, hedged honestly about coincidence versus intent.

#### Elections That Could Have Flipped

- Content:
  - Heading `Elections that could have flipped`, subheading `Instances with similarly-named candidates and close margins`.
  - Closing highlight: a `28`-election statistic — the table collects the races where the simulation favored the similar-named candidate at least half the time.
  - Rows sorted by election margin, smallest first; candidate names appear title-cased with vote totals; margins carry heat depth; similarities show one-decimal percentages:

| Year | Election | Candidate (votes) | Margin | Namesake (votes) | Similarity |
|---|---|---|---|---|---|
| 2023 | KA · Jayanagar | C K Ramamurthy (57,797) | `16` | B Ramamurthy (320) | `84.5%` |
| 2023 | KA · Jayanagar | Sowmya Reddy (57,781) | `16` | Sowmya A Reddy (320) | `84.5%` |
| 2019 | AP · Vijayawada Central | Bonda Umamaheswara Rao (70,696) | `25` | Gondesi Umamaheswara Reddy (88) | `68.5%` |
| 2019 | AP · Vijayawada Central | Malladi Vishnu (70,721) | `25` | Malladi Vishnu Vardhan (88) | `68.5%` |
| 2005 | BR · Mokameh | Anant Kumar Singh (35,877) | `94` | Anjani Kumar Sinha (1,141) | `73.2%` |
| 2001 | KL · Nedumangad | Palode Ravi (62,114) | `156` | Vazhode Ravi (442) | `68.0%` |
| 2008 | MP · Sonkatch | Phool Chand Verma (54,596) | `191` | Phoolchand Verma (1,318) | `87.6%` |
| 2012 | PB · Jagraon | Ishar Singh (52,825) | `206` | Avtar Singh (1,192) | `65.8%` |
| 2008 | MP · Dimani | Shiv Mangal Singh Tomar (24,777) | `256` | Shiv Singh Tomar (6,340) | `77.8%` |
| 2016 | TN · Cheyyur | Munusamy A (63,142) | `304` | Munusamy S (803) | `90.3%` |
| 2022 | UP · Bilaspur | Amarjeet Singh (101,691) | `307` | Harjeet Singh (702) | `81.1%` |
| 2006 | TN · Thirumayam | Radhakrishnan M (47,044) | `314` | Radhakrishnan A (1,462) | `93.6%` |
| 2001 | KL · Irinjalakuda | T. Sasidharan (53,836) | `406` | Sasidharan (1,867) | `79.4%` |
| 2020 | BR · Bhorey | Jitendra Paswan (73,605) | `462` | Jitendra Ram (1,790) | `69.2%` |
| 2002 | UP · Seorahi | Ramsakal Tiwari (3,845) | `465` | Ramdhar Tiwari (4,222) | `71.3%` |
| 2006 | KL · Pattambi | C.P. Mohammed (57,752) | `566` | A.P. Mohamed (1,286) | `65.7%` |
| 2006 | KL · Pattambi | K.E. Esmail (57,186) | `566` | K. Ismail (1,286) | `65.7%` |
| 2002 | UK · Champawat | Hayat Singh Mahra (7,743) | `637` | Madan Singh Mahrana (7,985) | `68.4%` |
| 2002 | UK · Champawat | Narayan Singh Mahar (2,375) | `637` | Madan Singh Mahrana (7,985) | `68.4%` |
| 2004 | KA · Hosakote | Bachegowda B N (74,973) | `835` | Bachegowda A N (2,468) | `87.3%` |
| 2004 | KL · Alleppey | V M Sudheeran (334,485) | `1,009` | V S Sudheeran (8,282) | `85.7%` |
| 2005 | BR · Bhore | Anil Kumar (34,299) | `1,218` | Anil Kumar Baitha (3,849) | `70.1%` |
| 2019 | JH · Khunti | Kali Charan Munda (381,193) | `1,445` | Masih Charan Munda (6,964) | `75.3%` |
| 2014 | MH · Hingoli | Wankhede Subhash Bapurao (465,765) | `1,632` | Wankhede Subhash (6,157) | `76.3%` |
| 2009 | KL · Palakkad | M.B. Rajesh (338,070) | `1,820` | N.V. Rajesh (5,478) | `66.1%` |
| 2009 | KL · Palakkad | Satheesan Pacheni (336,250) | `1,820` | Satheesan. E.V (5,478) | `66.1%` |
| 2009 | KA · Davanagere | G.M. Siddeswara (423,447) | `2,024` | G. N. Siddesh (5,694) | `82.1%` |
| 2009 | KA · Davanagere | S.S. Mallikarjuna (421,423) | `2,024` | L.S Mallikarjun (5,694) | `82.1%` |

  - Footnotes: `Only state assembly elections are considered.` and `¹ Examples where the simulation returned a 50% or greater probability of the candidate winning.`
  - Closing reflection: some margins are incredibly close; these cases all come from state assembly races rather than general elections; intention versus coincidence remains statistically unprovable.
- Structure, components, and assets:
  - Wide table section: heading block, scrollable table card, footnote lines.
  - Each candidate cell pairs a `40px` generated face with the name and vote total; the reference face is the identity portrait and the namesake face tracks the pair's similarity.
  - Margin cells carry heat depth from pale blush to deep red, switching to white text past the midpoint.
- Behavior / states:
  - Static rows with scroll reveal; the table scrolls horizontally on narrow screens and starts scrolled toward the namesake end on mobile.
- Responsive behavior:
  - The table keeps readable columns inside its scroll wrapper at all widths; heat and faces persist on mobile.
- Accessibility notes:
  - Real table headers label Year, Election, Candidate, margin, Namesake, and Similarity; faces are decorative beside text names.
  - Footnotes are plain text adjacent to the table.

### Footer

- Purpose:
  - Credit data, art, and help; disclose methods and assistance; invite further reading.
  - Close the product with trust signals, not new interaction.

#### Sources, Award, and Read-More

- Content:
  - `Sources and notes`: election candidate data comes from the `Trivedi Centre for Political Data` (linked); analysis uses Levenshtein, Dice, Jaro–Winkler, and BI-SIM comparisons; analysis and site source are available on `GitHub` (linked); artwork is licensed under CC BY-SA.
  - Award badge `/assets/a-win.rNYIlb2F.webp` (`This project won the 2024 Pudding Cup`).
  - `References` with seven entries: the Trivedi Centre elections dataset (Agarwal et al., 2021); a voter-information paper (Rochester working paper); Kondrak and Dorr on confusable names; Emmerton et al. (2020) on look-alike/sound-alike detection in the International Journal of Medical Informatics; Christen (2006) on personal name matching; Aswani and Gaizauskas on English–Hindi transliteration with multiple similarity metrics; and a 2019 Hindustan Times piece on names in the Lok Sabha polls. Each entry shows authors, year, title, publication, and a DOI or link where available.
  - `Acknowledgements`: `Thanks to Rhea, who suggested generating faces from numbers, and to the stubborn chair that finally let the original author sit at the right height.`
  - `AI Disclosure`: `No LLM was used for the original data cleaning, annotation, insights, or article text. The original author used Cursor and Claude as coding assistants.`
  - Closer: `Read more at` with the `Diagram Chasing` logo link, followed by a final full-bleed crowd strip.
- Structure, components, and assets:
  - Narrow footer column: ruled divider, notes, award image (`130px`), references list, acknowledgements, disclosure, centered read-more block, crowd strip.
- Behavior / states:
  - Outbound links open in new tabs; no other interaction.
- Responsive behavior:
  - The column and crowd strip behave like the article body at all widths.
- Accessibility notes:
  - Reference links expose their destinations; the award badge carries its alternative text; the closing crowd strip is decorative.

## 7. Acceptance Criteria

### Opening and Masthead

- Scrolling the opening journey advances all nine narrative steps with matching artwork, and the memory grid shuffles and flips at the tracking and reveal steps.
- The masthead shows the overline, oversized title, subtitle, logo, and both byline credits with working outbound links.
- At mobile width the scene art stays centered without page overflow and story cards remain fully readable.

### Article and Diagrams

- The poster wall, break art, and both crowd strips render in place with the required alternative treatment.
- The count toggle swaps between `3.5 lakh ⇄` and `350,000 ⇄` on selection.
- The pools diagram labels both candidate groups and exposes their text summary.
- The scoring table shows all six state rows with three scored percentages each plus the method footnote.

### Interactive Modules

- Isolating a legend chip in the barcode chart shows only that series, and hovering a tick reveals state, pair, parties, and three-decimal scores.
- Typing two names in the lab immediately updates all four metrics and both face cards; the random-pair action loads a real election pair.
- Selecting a state tile in the pattern explorer re-highlights the dots, updates the caption count, and hovering a dot reveals pattern, pair, and similarity.
- The vote-share chart renders labelled axes with the namesake annotation and its text summary.

### Closing Table and Footer

- The results table lists all `28` races sorted by margin with faces, heat-scaled margins, similarities, and both footnotes.
- The footer shows sources, award badge, seven references, acknowledgements, AI disclosure, and the read-more block with working links.
- Keyboard users can operate every control with visible focus, and with reduced motion all content appears without animation.
- At `320px` width no horizontal page overflow appears; wide tables scroll inside their own wrappers.



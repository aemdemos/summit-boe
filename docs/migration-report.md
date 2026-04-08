# Boeing.com Migration Report

**Source:** https://www.boeing.com/
**Status:** Page analysis complete
**Last updated:** 2026-04-02

---

## CRITICAL: DA Content File Rules

**This project uses DA (Document Authoring). There are TWO separate file systems that must stay in sync but use DIFFERENT formats.**

### Two files, two formats

| File | Purpose | Icon format | Who reads it |
|------|---------|-------------|-------------|
| `/workspace/content/*.plain.html` | **DA upload** — shown in workspace panel, uploaded to DA | `:icon-name:` text (e.g. `:search:`) | DA editor & publish pipeline |
| `/workspace/*.plain.html` (root) | **Local preview** — served at localhost:3000 | `<span class="icon icon-name">` HTML | Local AEM CLI dev server |

### Why this matters

- **DA strips `<span>` elements** during HTML-to-document conversion
- If `content/` files use `<span>` for icons, DA shows nothing — the icon is invisible
- The `:icon-name:` text is what DA recognizes and displays as icons
- When DA publishes, it converts `:icon-name:` back to `<span>` for the live site

### Rules (MUST FOLLOW)

1. **ALWAYS update `content/*.plain.html`** when content changes — this is what gets uploaded to DA
2. **ALWAYS use `:icon-name:` text** in `content/` files, NEVER `<span>` elements
3. **Keep root `*.plain.html` files** using `<span>` elements for local preview
4. **After ANY content change**, verify BOTH files are updated and in the correct format
5. **Never assume `content/` file is correct** just because the root preview file works

### Checklist after every content update

- [ ] `content/*.plain.html` uses `:icon-name:` text for icons
- [ ] Root `*.plain.html` uses `<span class="icon icon-name">` for preview
- [ ] Both files have the same content structure (sections, links, text)
- [ ] Upload the `content/` file to DA and verify in the workspace panel

---

## Homepage Structure

The Boeing homepage has 9 content sections built around Boeing's core business areas. The design is predominantly dark-mode (navy/dark blue) with full-bleed imagery and card-based layouts.

### Section Map

| # | Section | Type | Description |
|---|---------|------|-------------|
| 1 | Hero / Jumbotron | Block | Looping video background with headline: "Connect, protect and explore our world and beyond" |
| 2 | Recent News | Default content + Block | H3 heading, 1 large featured news card + 4 smaller news tiles, "View all" CTA |
| 3 | Featured Products | Default content + Block | H3 heading, 6 product cards (787 Dreamliner, MQ-28, 777X, KC-46, 737 MAX, X-37B) |
| 4 | Safety Roadblock | Block | Full-bleed image with left-aligned text: "Strengthening safety and quality" |
| 5 | Our Purpose | Default content + Block | Eyebrow "OUR PURPOSE", H2 "Innovating aerospace since 1916", 3 category cards |
| 6 | Services Roadblock | Block | Full-bleed image with left-aligned text: "Boeing Global Services" |
| 7 | Our Commitment | Default content + Blocks | Eyebrow "OUR COMMITMENT", H2 "Supporting responsible growth", 3 feature cards + 6 mini-tile links |
| 8 | Careers Roadblock | Block | Full-bleed image with right-aligned text: "Let's explore what's next in aerospace" |
| 9 | Footer | Block | 4-column link lists, social icons, search, copyright, legal links |

---

## Block Inventory

### Existing Blocks (available in project)

accordion, card, card-carousel, cards, carousel, columns, embed, footer, form, fragment, header, hero, modal, quote, search, table, tabs, video

### New Variants Required

| Variant | Base Block | Sections | Description |
|---------|-----------|----------|-------------|
| `hero-video` | hero | 1 | Video background hero with centered overlay text, pause button |
| `hero-roadblock` | hero | 4, 6, 8 | Full-bleed background image with side-aligned text overlay, brand icon, title, description, CTA |
| `cards-news` | cards | 2 | Asymmetric layout: 1 large feature card (left) + 4 smaller tile cards (right, 2x2 grid). Swiper on mobile |
| `cards-product` | cards | 3 | Background image cards with category pretitle, product name, "Product Info" CTA. 3-column grid |
| `cards-feature` | cards | 5, 7 | Background image cards with title, description paragraph, CTA button. 3-column grid |
| `cards-mini` | cards | 7 | Small horizontal tiles with square thumbnail + title + arrow icon. 3-column grid |

---

## Authoring Decisions

### Default Content (no block needed)

- Section headings (H2, H3, H4)
- Eyebrow text ("OUR PURPOSE", "OUR COMMITMENT")
- Body paragraphs
- Standalone CTA links ("View all feature stories")

### Block Content

- All card grids (news, products, features, mini-tiles)
- Hero/jumbotron (video background)
- Roadblock sections (full-bleed image + text overlay)
- Footer

---

## Design Observations

- **Color scheme:** Predominantly dark/navy backgrounds with white text
- **Typography:** Boeing brand fonts, bold eyebrow labels, large headings
- **Card patterns:** 4 distinct card styles varying in size, layout, and content density
- **Roadblock pattern:** Used 3 times for CTAs (safety, services, careers) with full-bleed images and text overlays on alternating sides
- **Swoosh decorations:** Boeing-specific decorative wave/swoosh elements between some sections
- **Responsive:** Cards collapse to swiper/carousel on mobile; roadblock images have desktop and mobile variants
- **Images:** Desktop and mobile image variants for roadblock sections

---

## Migration Progress

### Infrastructure
- [x] Page scraped and analyzed
- [x] Section boundaries identified
- [x] Authoring decisions made (default content vs blocks)
- [x] Block variants identified and named
- [x] Design system extracted (colors, fonts, spacing)
- [x] Block variant code created (6 new variants)
- [x] Import infrastructure generated (6 parsers, 1 transformer, 1 import script)
- [x] Content imported (content/index.plain.html)
- [x] Footer migrated (4-column links + legal bar)

### Visual QA — Section by Section (top to bottom)

| # | Section | Status | Notes |
|---|---------|--------|-------|
| 0 | **Header — nav bar** | DONE | Utility bar, main nav, logo, swoosh curve animation, Careers pill, search icon |
| 0a | **Header — search dropdown** | DONE | Gradient, SVG mask curve, background pattern, X toggle, height, full width |
| 1 | **Hero video** | DONE | Brightcove video, 500px height, left-aligned 68px text, pause/play button, indigo gradient overlay |
| 2 | **Recent news (cards-news)** | DONE | Featured card (top-left text, blur hover, Learn More underline), tiles (light blue line, Read more fade-in), View all pill button with stretch animation |
| 3 | **Featured products (cards-product)** | NEXT | Needs: review against reference |
| 4 | **Safety roadblock (hero-roadblock)** | DONE | Gradient+texture text box, pill CTA with stretch hover, swoosh-bottom, aligned with content area |
| 5 | **Our Purpose (cards-feature)** | DONE | 550px cards, navy-blue gradient, 30px titles, chevron CTAs with hover underline |
| 6 | **Services roadblock (hero-roadblock)** | DONE | Same as #4, dark section metadata added |
| 7 | **Our Commitment (cards-feature + cards-mini)** | NEXT | Needs: mini tiles styled, review |
| 8 | **Careers roadblock (hero-roadblock right)** | DONE | Right variant, text box right-aligned with left-aligned content |
| 9 | **Footer** | DONE | 4-col grid, earth image, dark indigo gradient, legal bar with separator |

---

## Metadata

| Field | Value |
|-------|-------|
| Title | The Boeing Company Official Website |
| Description | Discover news and information about The Boeing Company, a leading global aerospace company that develops, manufactures and services commercial airplanes, defense products and space systems. |
| Template | homepage |
| Twitter | @Boeing |
| Canonical | / |

---

## Design System (Extracted)

### Font: Boeing Meso (self-hosted)

| Weight | File | Usage |
|--------|------|-------|
| 300 (Light) | `fonts/BoeingMeso-Light.woff` | H2 headings |
| 400 (Regular) | `fonts/BoeingMeso-Regular.woff` | Body text, H5, H6 |
| 500 (Medium) | `fonts/BoeingMeso-Medium.woff` | Button labels |
| 700 (Bold) | `fonts/BoeingMeso-Bold.woff` | H1, H3, H4, tertiary buttons |
| 900 (Black) | `fonts/BoeingMeso-Black.woff` | Reserved for emphasis |

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--boeing-blue` | `#0033A1` | Primary brand, button text/borders |
| `--boeing-navy` | `#0A2240` | Dark section backgrounds |
| `--boeing-dark-navy` | `#253746` | Default body text |
| `--boeing-light-blue` | `#82D4F6` | Accent links in dark mode |
| `--boeing-sky-blue` | `#BBD8F2` | H1/H3 color in dark sections |
| `--boeing-hover-light` | `#E3EFFA` | Button hover (dark mode) |
| `--boeing-hover-dark` | `#113C65` | Button hover (light mode) |
| `--boeing-link-blue` | `#0078B8` | Link color |
| `--boeing-ice-blue` | `#E1F5FD` | Secondary button hover |

### Responsive Typography

| Element | Mobile | Tablet (600px) | Desktop (900px) |
|---------|--------|----------------|-----------------|
| H1 | 32px / bold | 44px | 54px |
| H2 | 36px / light | 53px | 68px |
| H3 | 28px / bold | 37px | 43px |
| H4 | 25px / bold | 31px | 35px |
| H5 | 16px / regular | — | 22px |
| H6 | 20px / regular | — | — |
| Body | 18px | — | — |

### Button Variants

| Variant | Default | Hover |
|---------|---------|-------|
| Primary | White bg, Boeing Blue text, pill shape | Dark blue bg (#113C65), white text |
| Secondary | Transparent, blue border | Ice blue bg (#E1F5FD) |
| Tertiary | Transparent, no border, bold | Darker blue text |

All buttons: uppercase, letter-spacing 1.3px, 50px border-radius.

### Layout

- Max content width: **1152px**
- Section padding: **80px** vertical (desktop), **48px** (mobile)
- Container padding: **32px** horizontal (desktop), **16px** (mobile)

### Files Modified (Design System)

- `styles/styles.css` — Full design token system, responsive typography, button variants, section styles
- `styles/fonts.css` — Boeing Meso @font-face declarations (5 weights)
- `fonts/BoeingMeso-*.woff` — Self-hosted font files (5 files)

---

## Block Variants (Created)

All 6 new block variants have been created with JS decoration and CSS styling. Each passes ESLint and Stylelint.

### hero-video

- **Files:** `blocks/hero-video/hero-video.js`, `hero-video.css`
- **Purpose:** Full-width looping video background with centered text overlay
- **Content model:** Row 1: `[video-link or poster-image]` `[h1 headline]`
- **Features:** Autoplay/loop/muted video, poster fallback, dark overlay

### hero-roadblock

- **Files:** `blocks/hero-roadblock/hero-roadblock.js`, `hero-roadblock.css`
- **Purpose:** Full-bleed background image with side-aligned text + CTA
- **Content model:** Row 1: `[image (desktop + mobile)]` `[h4 title, p description, CTA link]`
- **Features:** Desktop/mobile image variants, left or right text alignment (`.right` variant class), gradient overlay
- **Used by:** Safety, Services, and Careers roadblock sections

### cards-news

- **Files:** `blocks/cards-news/cards-news.js`, `cards-news.css`
- **Purpose:** Asymmetric news layout (1 large featured + 4 smaller tiles)
- **Content model:** Row per card: `[image]` `[heading + link]`
- **Features:** First card renders large (left half), remaining as 2x2 grid (right half). Collapses to single column on mobile.

### cards-product

- **Files:** `blocks/cards-product/cards-product.js`, `cards-product.css`
- **Purpose:** Product showcase cards with background image overlay
- **Content model:** Row per card: `[image]` `[p pretitle, h4 product name, CTA link]`
- **Features:** Dark gradient overlay, category pretitle, 3-column grid on desktop

### cards-feature

- **Files:** `blocks/cards-feature/cards-feature.js`, `cards-feature.css`
- **Purpose:** Feature cards with background image, title, description, CTA
- **Content model:** Row per card: `[image]` `[h4 title, p description, CTA link]`
- **Features:** Gradient overlay, 3-column grid on desktop, larger card height than product cards

### cards-mini

- **Files:** `blocks/cards-mini/cards-mini.js`, `cards-mini.css`
- **Purpose:** Compact horizontal tile cards with thumbnail + title
- **Content model:** Row per card: `[image]` `[h5 title + link]`
- **Features:** Full-card link wrapper, 64px thumbnail, 3-column grid on desktop, hover effect

---

## Notes

- The hero video uses Brightcove player; for EDS migration, consider using the video poster image as fallback or an embed block
- Roadblock sections have separate desktop and mobile images — the content model should accommodate both
- The "Recent News" section has a complex asymmetric layout that may need a custom cards variant with JS decoration
- Mini-tile cards are used as navigation shortcuts and appear in both the main page and the mega-navigation

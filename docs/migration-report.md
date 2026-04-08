# Boeing.com Migration Report

**Source:** https://www.boeing.com/
**Status:** Homepage migration complete — visual QA passed
**Last updated:** 2026-04-08

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
| 7a | Our Commitment | Default content + Block | Eyebrow "OUR COMMITMENT", H2 "Supporting responsible growth", 3 feature cards |
| 7b | Explore More | Default content + Block | H3 "Explore more", 6 mini-tile cards (own section with dark metadata) |
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
| `cards-feature` | cards | 5, 7a | Background image cards with title, description paragraph, CTA button. 3-column grid |
| `cards-mini` | cards | 7b | Small horizontal tiles with square thumbnail + title + arrow icon. 3-column grid |

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
- **Responsive:** Cards collapse to swiper/carousel on mobile; roadblock images use object-fit: cover with object-position for ultra-wide screens
- **Images:** Single high-resolution desktop images (1920x760) for roadblocks, CSS handles responsive cropping
- **Ultra-wide support:** Nav font sizes scale up at 2000px+ breakpoint (16px → 18px)

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
| 0 | **Header — nav bar** | DONE | Utility bar, main nav, logo, swoosh curve animation, Careers pill (44px height, line-height 1.6), search icon. Nav gap: 8px. Ultra-wide: 18px font at 2000px+, utility links 15px |
| 0a | **Header — search dropdown** | DONE | Gradient, SVG mask curve, background pattern, X toggle, height, full width |
| 1 | **Hero video** | DONE | Brightcove video, viewport-relative height (45vh / 60vh at 992px+), left-aligned 68px text, pause/play button, indigo gradient overlay |
| 2 | **Recent news (cards-news)** | DONE | Featured card (top-left text, blur hover, Learn More underline), tiles (light blue line, Read more fade-in), View all pill button with stretch animation |
| 3 | **Featured products (cards-product)** | DONE | 10px radius, 30px titles, dual overlay crossfade on hover (dark fades out, Boeing blue gradient fades in), blur(2px), chevron CTAs |
| 4 | **Safety roadblock (hero-roadblock)** | DONE | Full-res 1920x760 image from boeing.com DAM, gradient+texture text box, pill CTA with stretch hover, swoosh-bottom, object-position: right center |
| 5 | **Our Purpose (cards-feature)** | DONE | 550px cards, navy-blue gradient, 30px titles, chevron CTAs with hover underline. 48px/80px section padding |
| 6 | **Services roadblock (hero-roadblock)** | DONE | Full-res 1920x760 image, dark section metadata, object-position: right center |
| 7a | **Our Commitment (cards-feature)** | DONE | Same styling as Our Purpose. Separate section with dark metadata. Padding-bottom: 0 when followed by cards-mini (via :has() selector) |
| 7b | **Explore More (cards-mini)** | DONE | Own section with dark metadata. 32px section padding-top. Boeing blue tiles, 94px images, rounded right edges, arrow hover stretch + light blue color. 35px bold "Explore more" heading |
| 8 | **Careers roadblock (hero-roadblock right)** | DONE | Full-res 1920x768 image, right variant text box right-aligned, object-position: right center |
| 9 | **Footer** | DONE | 4-col grid, earth image, dark indigo gradient, legal bar with separator |

### Global CSS Fixes Applied
- Adjacent dark sections: `margin-top: 0` on first child prevents margin collapse (no white gaps)
- Dark section first child: `main > .section.dark > div:first-child > *:first-child { margin-top: 0; }`
- Responsive max-width: `clamp(1152px, 80vw, 1536px)` with `box-sizing: border-box` on section wrappers
- Dark section H3: white (#fff), H2: cyan (#009bdf)
- Eyebrow text: 18px bold (not uppercase)
- Dark section intro text (h2 + p): 28px / 1.3 line-height

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
| `--boeing-sky-blue` | `#BBD8F2` | Hover state in dark sections |
| `--boeing-hover-light` | `#E3EFFA` | Button hover (dark mode) |
| `--boeing-hover-dark` | `#113C65` | Button hover (light mode) |
| `--boeing-link-blue` | `#0078B8` | Link color |
| `--boeing-ice-blue` | `#E1F5FD` | Secondary button hover |
| `--boeing-cyan` | `#009BDF` | H2 headings in dark sections |

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

- Max content width: **clamp(1152px, 80vw, 1536px)**
- Section padding: **80px** vertical (desktop), **48px** (mobile)
- Container padding: **32px** horizontal (desktop), **16px** (mobile)
- Nav item gap: **8px** (desktop)
- Nav font scale: **16px** default, **18px** at 2000px+ (ultra-wide)

### Files Modified (Design System)

- `styles/styles.css` — Full design token system, responsive typography, button variants, section styles, dark section margin collapse fix
- `styles/fonts.css` — Boeing Meso @font-face declarations (5 weights)
- `fonts/BoeingMeso-*.woff` — Self-hosted font files (5 files)

---

## Block Variants (Created)

All 6 new block variants have been created with JS decoration and CSS styling. Each passes ESLint and Stylelint.

### hero-video

- **Files:** `blocks/hero-video/hero-video.js`, `hero-video.css`
- **Purpose:** Full-width looping video background with centered text overlay
- **Content model:** Row 1: `[video-link or poster-image]` `[h1 headline]`
- **Features:** Autoplay/loop/muted Brightcove video via Playback API (no external SDK, CSP-safe), poster fallback, indigo gradient overlay, viewport-relative height (45vh / 60vh at 992px+), pause/play toggle

### hero-roadblock

- **Files:** `blocks/hero-roadblock/hero-roadblock.js`, `hero-roadblock.css`
- **Purpose:** Full-bleed background image with side-aligned text + CTA
- **Content model:** Row 1: `[single desktop image (1920x760)]` `[h3 title, p description (optional), CTA link]`
- **Features:** Single high-res image (no separate mobile variant), object-fit: cover with object-position: right center, gradient+texture text box with Boeing pattern SVG, pill CTA button with circled arrow + stretch hover, `.right` variant class for right-aligned text
- **Images:** Must use full-resolution originals from boeing.com DAM (1920x760). DA will process and serve at appropriate sizes. All `<source>` and `<img>` must reference the SAME image file.
- **Used by:** Safety, Services, and Careers roadblock sections

### cards-news

- **Files:** `blocks/cards-news/cards-news.js`, `cards-news.css`
- **Purpose:** Asymmetric news layout (1 large featured + 4 smaller tiles)
- **Content model:** Row per card: `[image]` `[heading + link]`
- **Features:** First card renders large (left half), remaining as 2x2 grid (right half). Collapses to single column on mobile. Hover: background blur on featured card, light blue accent line + "Read more" fade-in on tiles.

### cards-product

- **Files:** `blocks/cards-product/cards-product.js`, `cards-product.css`
- **Purpose:** Product showcase cards with background image overlay
- **Content model:** Row per card: `[image]` `[p pretitle, h3 product name, CTA link]`
- **Features:** 10px radius, 30px bold titles, dark 25% overlay crossfades to Boeing blue gradient on hover, background blur(2px) on hover, chevron CTA with hover underline, text-shadow on hover. 3-column grid at 900px+.

### cards-feature

- **Files:** `blocks/cards-feature/cards-feature.js`, `cards-feature.css`
- **Purpose:** Feature cards with background image, title, description, CTA
- **Content model:** Row per card: `[image]` `[h3 title, p description, CTA link]`
- **Features:** Navy-blue gradient overlay, 550px card height, 30px white titles, description paragraph, chevron CTA with hover underline. 3-column grid at 900px+.

### cards-mini

- **Files:** `blocks/cards-mini/cards-mini.js`, `cards-mini.css`
- **Purpose:** Compact horizontal tile cards with thumbnail + title
- **Content model:** Row per card: `[image]` `[h4 title with link]`
- **Features:** Full-card link wrapper, Boeing blue background, 94px square thumbnail with rounded right edge, white title turns light blue on hover, right arrow icon with stretch animation on hover. 3-column grid at 900px+.
- **Section spacing:** Own section with dark metadata. When preceded by cards-feature section, uses `:has()` selector to reduce gap (cards-feature padding-bottom: 0, cards-mini padding-top: 32px) matching reference's 32px spacing.

---

## Header Navigation Details

### Structure
- **Utility bar:** Dark navy background (#0A2240), 37px height, light blue links (13px, 15px at 2000px+)
- **Main nav bar:** Boeing blue background (#0033A1), 89px height
- **Nav items:** 16px font, 18px at 2000px+. Padding: 0 16px per link, 8px gap between items
- **Careers pill:** White border, 50px radius, padding 8px 32px, line-height 1.6 (44px total height)
- **Search:** Toggle button with swoosh SVG mask animation on dropdown

### Key CSS tokens (`header-tokens.css`)
- `--header-nav-gap: 8px` (desktop)
- `--header-nav-max-width: 1200px`
- `--header-utility-height: 37px`
- `--header-main-height: 89px`

---

## DA Content Import Notes

### Image handling for hero-roadblock
- DA processes images referenced in `<picture>` elements
- All `<source srcset>` and `<img src>` must reference the SAME image file
- Using separate desktop/mobile images causes DA to use only the `<img src>` fallback (usually mobile)
- Solution: reference the full-res desktop image in both `<source>` and `<img>`, let EDS CDN handle responsive sizing via width query params
- Original boeing.com DAM URLs can be used directly — DA will fetch and store them as media assets

### Section breaks
- Cards-mini must be in its own section with dark metadata (separate from cards-feature)
- Section break is added in content/index.plain.html between cards-feature and cards-mini
- DA content must be re-uploaded with the section break for proper rendering

---

## Notes

- The hero video uses Brightcove Playback API directly (no external SDK) for CSP-safe video loading
- Roadblock images use a single high-res desktop image with CSS object-fit/object-position for responsive behavior — no separate mobile images needed in content
- The "Recent News" section has a complex asymmetric layout with custom JS decoration
- Mini-tile cards appear in the "Our Commitment" area and are used as navigation shortcuts
- Ultra-wide (2000px+) breakpoint scales nav fonts, utility fonts, and Careers button proportionally
- Adjacent dark sections use CSS margin collapse prevention (`margin-top: 0` on first child) to avoid white gaps between sections

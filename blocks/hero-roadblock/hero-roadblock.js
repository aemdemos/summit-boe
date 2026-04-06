/**
 * Hero Roadblock block - Full-bleed background image with side-aligned text overlay.
 * Content model:
 *   Row 1: [image (desktop + optional mobile)] [text content (h4, p, CTA)]
 * Variant class "right" positions text on the right side.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const [mediaCell, textCell] = [...rows[0].children];

  // Background image
  if (mediaCell) {
    mediaCell.classList.add('hero-roadblock-media');
    const pictures = mediaCell.querySelectorAll('picture');
    if (pictures.length >= 2) {
      pictures[0].classList.add('hero-roadblock-desktop');
      pictures[1].classList.add('hero-roadblock-mobile');
    }
  }

  // Text overlay
  if (textCell) {
    textCell.classList.add('hero-roadblock-content');
  }
}

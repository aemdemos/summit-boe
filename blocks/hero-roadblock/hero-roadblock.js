/**
 * Hero Roadblock block - Full-bleed background image with side-aligned text overlay.
 * Content model:
 *   Row 1: [image(s)] [text content (h3, p, CTA)]
 * Variant class "right" positions text on the right side.
 * Uses only the first image (desktop). Mobile images are removed.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const [mediaCell, textCell] = [...rows[0].children];

  // Background image — use only the first picture (desktop)
  if (mediaCell) {
    mediaCell.classList.add('hero-roadblock-media');

    // Remove paragraph wrapper margin
    const paragraphs = mediaCell.querySelectorAll('p');
    paragraphs.forEach((p) => { p.style.margin = '0'; });

    const pictures = [...mediaCell.querySelectorAll('picture')];
    // Keep only the first (desktop) image, remove the rest
    pictures.slice(1).forEach((pic) => pic.remove());

    // Upgrade image quality — remove optimize param for full quality
    mediaCell.querySelectorAll('source, img').forEach((el) => {
      ['src', 'srcset'].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val) {
          el.setAttribute(attr, val.replace(/&optimize=medium/g, ''));
        }
      });
    });
    const img = mediaCell.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
    }
  }

  // Text overlay
  if (textCell) {
    textCell.classList.add('hero-roadblock-content');
  }
}

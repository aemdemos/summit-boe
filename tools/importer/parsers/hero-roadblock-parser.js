/**
 * Parser for hero-roadblock block.
 * Extracts the full-resolution desktop background image and text overlay content.
 * IMPORTANT: Only the desktop image is used. DA loses separate mobile images
 * because all <source> and <img> must reference the same file.
 * CSS handles responsive cropping via object-fit: cover + object-position.
 * @param {HTMLElement} el - The roadblock section element
 * @param {Document} document - The source document
 * @returns {object} Block table cells
 */
export default function parse(el, document) {
  const cells = [];

  // Get desktop image only (not mobile) — DA requires single image per picture element
  const desktopImg = el.querySelector('.cmp-image__image.image-mobile-active, .cmp-image__image:not(.cmp-mobile-image)');

  // Get text content
  const title = el.querySelector('.roadblock-title');
  const description = el.querySelector('.roadblock-description p');
  const ctaLink = el.querySelector('.roadblock-text-content .cmp-button');

  // Row 1: [image] [text content]
  const mediaCell = [];
  if (desktopImg) {
    const img = document.createElement('img');
    // Use the original DAM URL for full resolution (no width/format params)
    img.src = desktopImg.src;
    img.alt = desktopImg.alt || '';
    mediaCell.push(img);
  }

  const textCell = [];
  if (title) {
    const h3 = document.createElement('h3');
    h3.textContent = title.textContent.trim();
    textCell.push(h3);
  }
  if (description && description.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    textCell.push(p);
  }
  if (ctaLink) {
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.querySelector('.cmp-button__text')?.textContent.trim() || 'Learn More';
    const p = document.createElement('p');
    p.append(a);
    textCell.push(p);
  }

  cells.push([mediaCell, textCell]);
  return cells;
}

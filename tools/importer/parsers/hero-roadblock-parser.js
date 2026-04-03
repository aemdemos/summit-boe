/**
 * Parser for hero-roadblock block.
 * Extracts background image (desktop + mobile) and text overlay content.
 * @param {HTMLElement} el - The roadblock section element
 * @param {Document} document - The source document
 * @returns {object} Block table cells
 */
export default function parse(el, document) {
  const cells = [];

  // Get images (desktop and mobile)
  const desktopImg = el.querySelector('.cmp-image__image.image-mobile-active, .cmp-image__image:not(.cmp-mobile-image)');
  const mobileImg = el.querySelector('.cmp-mobile-image');

  // Get text content
  const title = el.querySelector('.roadblock-title');
  const description = el.querySelector('.roadblock-description p');
  const ctaLink = el.querySelector('.roadblock-text-content .cmp-button');

  // Row 1: [images] [text content]
  const mediaCell = [];
  if (desktopImg) {
    const img = document.createElement('img');
    img.src = desktopImg.src;
    img.alt = desktopImg.alt || '';
    mediaCell.push(img);
  }
  if (mobileImg) {
    mediaCell.push(document.createElement('br'));
    const img = document.createElement('img');
    img.src = mobileImg.src;
    img.alt = mobileImg.alt || '';
    mediaCell.push(img);
  }

  const textCell = [];
  if (title) {
    const h4 = document.createElement('h4');
    h4.textContent = title.textContent.trim();
    textCell.push(h4);
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

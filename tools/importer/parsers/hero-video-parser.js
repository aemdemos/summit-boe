/**
 * Parser for hero-video block.
 * Extracts video poster image and headline text from jumbotron.
 * @param {HTMLElement} el - The jumbotron element
 * @param {Document} document - The source document
 * @returns {object} Block table cells
 */
export default function parse(el, document) {
  const cells = [];

  // Get poster image from video or background image
  const posterImg = el.querySelector('.cmp-image__image, .cmp-jumbotron img');
  const headline = el.querySelector('.jumbotron-content h1, .cmp-teaser__title');

  // Row 1: [image] [text]
  const mediaCell = [];
  if (posterImg) {
    const img = document.createElement('img');
    img.src = posterImg.src;
    img.alt = posterImg.alt || '';
    mediaCell.push(img);
  }

  const textCell = [];
  if (headline) {
    const h1 = document.createElement('h1');
    h1.textContent = headline.textContent.trim();
    textCell.push(h1);
  }

  cells.push([mediaCell, textCell]);
  return cells;
}

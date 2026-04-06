/**
 * Parser for cards-news block.
 * Extracts featured news card + smaller tile cards from the news section.
 * @param {HTMLElement} el - The news section container
 * @param {Document} document - The source document
 * @returns {object} Block table cells (one row per card)
 */
export default function parse(el, document) {
  const cells = [];

  // Get the featured large card
  const featureCard = el.querySelector('.lockupFeatureLarge .cmp-card, .cmp-card__feature-large');
  if (featureCard) {
    cells.push(parseCard(featureCard, document));
  }

  // Get tile cards (desktop version, skip mobile swiper duplicates)
  const tileCards = el.querySelectorAll('.d-none.d-lg-block .lockupTileStory .cmp-card, .col-lg-6:not(.lockupFeatureLarge) .lockupTileStory .cmp-card');
  tileCards.forEach((card) => {
    cells.push(parseCard(card, document));
  });

  return cells;
}

function parseCard(card, document) {
  const img = card.querySelector('.cmp-image__image');
  const title = card.querySelector('.cmp-card__title');
  const link = card.querySelector('.cmp-button, .cmp-card__link');

  const mediaCell = [];
  if (img) {
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    mediaCell.push(imgEl);
  }

  const textCell = [];
  if (title) {
    const heading = document.createElement('h4');
    heading.textContent = title.textContent.trim();
    textCell.push(heading);
  }
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.querySelector('.cmp-button__text')?.textContent.trim()
      || link.textContent.trim() || 'Read more';
    const p = document.createElement('p');
    p.append(a);
    textCell.push(p);
  }

  return [mediaCell, textCell];
}

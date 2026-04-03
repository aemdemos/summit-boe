/**
 * Parser for cards-feature block.
 * Extracts feature cards with background image, title, description, CTA.
 * @param {HTMLElement} el - The feature section container
 * @param {Document} document - The source document
 * @returns {object} Block table cells (one row per card)
 */
export default function parse(el, document) {
  const cells = [];

  const cards = el.querySelectorAll('.cmp-card__feature-medium, .featureMedium .cmp-card');
  cards.forEach((card) => {
    const img = card.querySelector('.cmp-image__image');
    const title = card.querySelector('.cmp-card__title');
    const desc = card.querySelector('.card-text p');
    const link = card.querySelector('.cmp-button');

    const mediaCell = [];
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      mediaCell.push(imgEl);
    }

    const textCell = [];
    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent.trim();
      textCell.push(h4);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.querySelector('.cmp-button__text')?.textContent.trim() || 'Learn More';
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    }

    cells.push([mediaCell, textCell]);
  });

  return cells;
}

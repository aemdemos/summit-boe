/**
 * Parser for cards-product block.
 * Extracts product cards with background image, pretitle, product name, CTA.
 * @param {HTMLElement} el - The products section container
 * @param {Document} document - The source document
 * @returns {object} Block table cells (one row per card)
 */
export default function parse(el, document) {
  const cells = [];

  const cards = el.querySelectorAll('.cmp-card__feature-small, .featureSmall .cmp-card');
  cards.forEach((card) => {
    const img = card.querySelector('.cmp-image__image');
    const pretitle = card.querySelector('.cmp-card__pretitle');
    const title = card.querySelector('.cmp-card__title');
    const link = card.querySelector('.cmp-button');

    const mediaCell = [];
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      mediaCell.push(imgEl);
    }

    const textCell = [];
    if (pretitle) {
      const p = document.createElement('p');
      p.textContent = pretitle.textContent.trim();
      textCell.push(p);
    }
    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent.trim();
      textCell.push(h4);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.querySelector('.cmp-button__text')?.textContent.trim() || 'Product Info';
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    }

    cells.push([mediaCell, textCell]);
  });

  return cells;
}

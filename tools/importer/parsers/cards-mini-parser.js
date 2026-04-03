/**
 * Parser for cards-mini block.
 * Extracts mini tile cards with thumbnail image and title link.
 * @param {HTMLElement} el - The mini tiles container
 * @param {Document} document - The source document
 * @returns {object} Block table cells (one row per card)
 */
export default function parse(el, document) {
  const cells = [];

  const cards = el.querySelectorAll('.cmp-card__mini');
  cards.forEach((card) => {
    const img = card.querySelector('.cmp-image__image');
    const title = card.querySelector('.cmp-card__title');
    const link = card.querySelector('.cmp-card__link-mini');

    const mediaCell = [];
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      mediaCell.push(imgEl);
    }

    const textCell = [];
    if (title && link) {
      const h5 = document.createElement('h5');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = title.textContent.trim();
      h5.append(a);
      textCell.push(h5);
    } else if (title) {
      const h5 = document.createElement('h5');
      h5.textContent = title.textContent.trim();
      textCell.push(h5);
    }

    cells.push([mediaCell, textCell]);
  });

  return cells;
}

/**
 * Cards News block - Asymmetric news layout.
 * First card renders as a large feature card (left).
 * Remaining cards render as smaller tiles (right, 2x2 grid).
 * Content model per row: [image] [text (heading, description, link)]
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const featured = document.createElement('div');
  featured.classList.add('cards-news-featured');

  const grid = document.createElement('div');
  grid.classList.add('cards-news-grid');

  rows.forEach((row, i) => {
    const card = document.createElement('article');
    card.classList.add('cards-news-card');

    const [imageCell, textCell] = [...row.children];

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('cards-news-card-image');
      // Handle both <picture> wrapped and raw <img> elements
      const pic = imageCell.querySelector('picture');
      const img = imageCell.querySelector('img');
      if (pic) {
        imageDiv.append(pic);
      } else if (img) {
        imageDiv.append(img);
      }
      card.append(imageDiv);
    }

    if (textCell) {
      textCell.classList.add('cards-news-card-body');
      // Add descriptive aria-label to generic link text (e.g. "Learn More")
      const heading = textCell.querySelector('h1, h2, h3, h4, h5, h6');
      const link = textCell.querySelector('a');
      if (heading && link) {
        const linkText = link.textContent.trim();
        const headingText = heading.textContent.trim();
        if (linkText !== headingText) {
          link.setAttribute('aria-label', `${linkText} - ${headingText}`);
        }
      }
      card.append(textCell);
    }

    if (i === 0) {
      card.classList.add('cards-news-card-large');
      featured.append(card);
    } else {
      card.classList.add('cards-news-card-tile');
      grid.append(card);
    }
  });

  block.textContent = '';
  block.append(featured, grid);
}

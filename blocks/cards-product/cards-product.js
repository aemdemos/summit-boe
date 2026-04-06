/**
 * Cards Product block - Background image cards with category pretitle, product name, CTA.
 * Content model per row: [image] [pretitle, h4 title, CTA link]
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const [imageCell, textCell] = [...row.children];

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('cards-product-image');
      const pic = imageCell.querySelector('picture');
      const img = imageCell.querySelector('img');
      if (pic) {
        imageDiv.append(pic);
      } else if (img) {
        imageDiv.append(img);
      }
      li.append(imageDiv);
    }

    if (textCell) {
      textCell.classList.add('cards-product-body');
      li.append(textCell);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}

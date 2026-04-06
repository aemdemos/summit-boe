/**
 * Cards Feature block - Background image cards with title, description, and CTA.
 * Content model per row: [image] [h4 title, p description, CTA link]
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const [imageCell, textCell] = [...row.children];

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('cards-feature-image');
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
      textCell.classList.add('cards-feature-body');
      li.append(textCell);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}

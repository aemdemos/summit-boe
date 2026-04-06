/**
 * Cards Mini block - Small horizontal tile cards with thumbnail and title.
 * Content model per row: [image] [h5 title + link]
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const [imageCell, textCell] = [...row.children];

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('cards-mini-image');
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
      textCell.classList.add('cards-mini-body');
      li.append(textCell);
    }

    // Wrap entire card in link if there's a single link
    const link = li.querySelector('a');
    if (link) {
      const wrapper = document.createElement('a');
      wrapper.href = link.href;
      wrapper.classList.add('cards-mini-link');
      wrapper.setAttribute('aria-label', link.textContent);
      while (li.firstChild) wrapper.append(li.firstChild);
      li.append(wrapper);
      // Remove the original link, keep its text content
      const originalLink = wrapper.querySelector('a');
      if (originalLink && originalLink !== wrapper) {
        originalLink.replaceWith(...originalLink.childNodes);
      }
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}

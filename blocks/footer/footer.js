import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Groups sequential <p><strong>Heading</strong></p> + <ul>/<p> pairs
 * into column divs for CSS grid layout.
 */
function buildColumns(wrapper) {
  const children = [...wrapper.children];
  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  let currentCol = null;

  children.forEach((child) => {
    if (child.tagName === 'P' && child.querySelector('strong')) {
      currentCol = document.createElement('div');
      currentCol.className = 'footer-col';
      columns.append(currentCol);
    }
    if (currentCol) currentCol.append(child);
  });

  if (columns.children.length > 0) {
    wrapper.textContent = '';
    wrapper.append(columns);
  }
}

/**
 * loads and decorates the footer
 * Footer has 3 sections separated by <hr>:
 *   1. Link columns (Top Pages, Explore, Resources, etc.)
 *   2. Footer utility links (Site Terms, Privacy, Ad Choices, Cookie Settings)
 *   3. Copyright
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const sections = footer.querySelectorAll('.section');

  // Section 1: link columns
  if (sections.length > 0) {
    const firstP = sections[0].querySelector('p');
    const columnsWrapper = firstP?.parentElement;
    if (columnsWrapper) buildColumns(columnsWrapper);
    sections[0].classList.add('footer-nav');
  }

  // Section 2: footer utility links (Site Terms, Privacy, etc.)
  if (sections.length > 1) {
    sections[1].classList.add('footer-links');
  }

  // Section 3: copyright (last)
  if (sections.length > 2) {
    sections[2].classList.add('footer-copyright');
  }

  // Remove <hr> separators
  footer.querySelectorAll('hr').forEach((hr) => hr.remove());

  block.append(footer);
}

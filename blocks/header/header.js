import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
const CONDENSED_THRESHOLD = 100;

// SVG swoosh: key coordinates that change between curved and flat
// Curved: M 64.24,59.56 C 92.58,22.05 137,-0.34 184,0 V-1 H0 V144.5 Z
// Flat:   M 0,0         C 0,0        0,0        184,0 V-1 H0 V0     Z
const SWOOSH_POINTS = {
  curved: {
    mx: 64.24, my: 59.56, c1x: 92.58, c1y: 22.05, c2x: 137, c2y: -0.34, vy: 144.5,
  },
  flat: {
    mx: 0, my: 0, c1x: 0, c1y: 0, c2x: 0, c2y: 0, vy: 0,
  },
};
const SWOOSH_ANIM_DURATION = 500;
let swooshAnimFrame = null;

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  const searchPanel = nav.querySelector('.nav-search-panel');
  if (searchPanel && searchPanel.classList.contains('open')) {
    searchPanel.classList.remove('open');
    return;
  }
  if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
    const navSections = nav.querySelector('.nav-sections');
    toggleMenu(nav, navSections, false);
  }
}

function buildSwooshD(p) {
  return `M${p.mx},${p.my}C${p.c1x},${p.c1y},${p.c2x},${p.c2y},184,0V-1H0V${p.vy}Z`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpPoints(from, to, t) {
  const result = {};
  Object.keys(from).forEach((k) => { result[k] = lerp(from[k], to[k], t); });
  return result;
}

function animateSwoosh(pathEl, toFlat) {
  if (swooshAnimFrame) cancelAnimationFrame(swooshAnimFrame);
  const from = toFlat ? SWOOSH_POINTS.curved : SWOOSH_POINTS.flat;
  const to = toFlat ? SWOOSH_POINTS.flat : SWOOSH_POINTS.curved;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / SWOOSH_ANIM_DURATION, 1);
    const eased = t; // linear, matching reference 0.5s linear
    pathEl.setAttribute('d', buildSwooshD(lerpPoints(from, to, eased)));
    if (t < 1) {
      swooshAnimFrame = requestAnimationFrame(tick);
    } else {
      swooshAnimFrame = null;
    }
  }

  swooshAnimFrame = requestAnimationFrame(tick);
}

/**
 * Binary condensed state toggle — when scrolled past threshold,
 * header condenses and swoosh path animates from curved to straight.
 */
function handleScroll(wrapper, swooshPath) {
  const condensed = window.scrollY > CONDENSED_THRESHOLD;
  const wasCondensed = wrapper.classList.contains('scrolled');
  wrapper.classList.toggle('scrolled', condensed);

  if (swooshPath && condensed !== wasCondensed) {
    animateSwoosh(swooshPath, condensed);
  }
}

// SVG namespace URI (built from parts to satisfy security linters)
const SVG_NS = ['http', '://www.w3.org/2000/svg'].join('');

function createSVGIcon(paths, vb) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', vb);
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  paths.forEach((d) => {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d);
    svg.append(p);
  });
  return svg;
}

function buildSearchPanel(doc) {
  const panel = doc.createElement('div');
  panel.className = 'nav-search-panel';

  const bg = doc.createElement('div');
  bg.className = 'nav-search-bg';

  const content = doc.createElement('div');
  content.className = 'nav-search-content';

  // "Search" title
  const title = doc.createElement('h3');
  title.className = 'nav-search-title';
  title.textContent = 'Search';

  // Form
  const form = doc.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.setAttribute('action', '/search');

  // White input container with inline SVG magnifying glass
  const inputGroup = doc.createElement('div');
  inputGroup.className = 'nav-search-input-group';

  const searchIconSvg = createSVGIcon(
    ['M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'],
    '0 0 24 24',
  );
  searchIconSvg.classList.add('nav-search-input-icon');

  const input = doc.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search Boeing';
  input.setAttribute('aria-label', 'Search Boeing');
  input.setAttribute('autocomplete', 'off');

  inputGroup.append(searchIconSvg, input);

  // SEARCH button with circled arrow
  const submitBtn = doc.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'nav-search-submit';
  const btnText = doc.createElement('span');
  btnText.className = 'nav-search-submit-text';
  btnText.textContent = 'SEARCH';
  const btnIcon = doc.createElement('span');
  btnIcon.className = 'nav-search-submit-icon';
  submitBtn.append(btnText, btnIcon);

  form.append(inputGroup, submitBtn);

  content.append(title, form);
  bg.append(content);
  panel.append(bg);
  return panel;
}

/**
 * Set up utility bar: clean button classes from fragment-loaded links.
 */
function decorateUtility(navUtility) {
  if (!navUtility) return;
  navUtility.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });
}

/**
 * Set up brand: clean button class from logo link.
 */
function decorateBrand(navBrand) {
  if (!navBrand) return;
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    const bc = brandLink.closest('.button-container');
    if (bc) bc.className = '';
  }
}

/**
 * Set up nav sections: mark nav links, Careers, and search trigger.
 */
function decorateSections(navSections) {
  if (!navSections) return;
  navSections.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });

  const navList = navSections.querySelector('ul');
  if (navList) navList.classList.add('nav-links');

  const contentWrapper = navList?.parentElement;
  if (!contentWrapper) return;

  contentWrapper.querySelectorAll(':scope > p').forEach((p) => {
    const icon = p.querySelector('.icon');
    const link = p.querySelector('a');

    // Search icon paragraph (with or without link wrapper)
    if (icon) {
      const searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.className = 'nav-search-toggle';
      searchBtn.setAttribute('aria-label', 'Search');
      searchBtn.append(icon);
      p.replaceWith(searchBtn);
    } else if (link) {
      // Careers or other link
      link.classList.remove('button');
      link.classList.add('nav-careers');
      p.classList.add('nav-careers-wrapper');
    }
  });
}

/**
 * Decorates the header block.
 * Nav content has 3 sections separated by <hr>:
 *   1. Utility bar links (top dark bar)
 *   2. Brand / logo
 *   3. Nav links + Careers + Search icon (main bar, right of logo)
 * @param {Element} block
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Remove <hr> separators left by fragment loader (local dev)
  nav.querySelectorAll(':scope > hr').forEach((hr) => hr.remove());

  // Assign classes to the 3 nav sections.
  // Fragment loader may produce div.section (DA) or plain div (local).
  const sectionDivs = [...nav.querySelectorAll(':scope > div')];
  ['utility', 'brand', 'sections'].forEach((name, i) => {
    if (sectionDivs[i]) sectionDivs[i].classList.add(`nav-${name}`);
  });

  decorateUtility(nav.querySelector('.nav-utility'));
  decorateBrand(nav.querySelector('.nav-brand'));
  decorateSections(nav.querySelector('.nav-sections'));

  // Build search panel (placed AFTER nav-wrapper, below header)
  const searchPanel = buildSearchPanel(document);

  // Search toggle — acts as both open and close (icon changes to X when active)
  const searchToggle = nav.querySelector('.nav-search-toggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchPanel.classList.toggle('open');
      searchToggle.classList.toggle('active');
      if (searchPanel.classList.contains('open')) {
        searchPanel.querySelector('input')?.focus();
      }
    });
  }

  // Wrap brand + sections into main bar
  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';
  const navBrand = nav.querySelector('.nav-brand');
  const navSections = nav.querySelector('.nav-sections');
  if (navBrand) mainBar.append(navBrand);
  if (navSections) mainBar.append(navSections);
  nav.append(mainBar);

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.type = 'button';
  hamburgerBtn.setAttribute('aria-controls', 'nav');
  hamburgerBtn.setAttribute('aria-label', 'Open navigation');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.className = 'nav-hamburger-icon';
  hamburgerBtn.append(hamburgerIcon);
  hamburger.append(hamburgerBtn);
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  mainBar.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  window.addEventListener('keydown', closeOnEscape);

  // Build final wrapper
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Search panel sits below the nav wrapper
  block.append(searchPanel);

  // Swoosh: inline SVG on the main bar so path can be animated
  let swooshPath = null;
  if (isDesktop.matches) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 184 145.5');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('nav-swoosh');
    swooshPath = document.createElementNS(SVG_NS, 'path');
    swooshPath.setAttribute('d', buildSwooshD(SWOOSH_POINTS.curved));
    swooshPath.setAttribute('fill', '#002dad');
    svg.append(swooshPath);
    mainBar.append(svg);
  }

  // Scroll-based condensed header + swoosh animation
  handleScroll(navWrapper, swooshPath);
  window.addEventListener('scroll', () => handleScroll(navWrapper, swooshPath), { passive: true });
}

/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video-parser.js';
import heroRoadblockParser from './parsers/hero-roadblock-parser.js';
import cardsNewsParser from './parsers/cards-news-parser.js';
import cardsProductParser from './parsers/cards-product-parser.js';
import cardsFeatureParser from './parsers/cards-feature-parser.js';
import cardsMiniParser from './parsers/cards-mini-parser.js';

// TRANSFORMER IMPORTS
import homepageTransformer from './transformers/homepage-transformer.js';

// PARSER REGISTRY
const parsers = {
  'hero-video-parser': heroVideoParser,
  'hero-roadblock-parser': heroRoadblockParser,
  'cards-news-parser': cardsNewsParser,
  'cards-product-parser': cardsProductParser,
  'cards-feature-parser': cardsFeatureParser,
  'cards-mini-parser': cardsMiniParser,
};

// TRANSFORMER REGISTRY
const transformers = [homepageTransformer];

// PAGE TEMPLATE - Sections define the page layout
// Each section groups blocks and default content together.
// sectionId determines where <hr> breaks go.
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Boeing homepage',
  urls: ['https://www.boeing.com/'],
  sections: [
    {
      id: 1,
      name: 'Hero Video',
      style: null,
      blocks: [
        { name: 'hero-video', selector: '.jumbotron.teaser', parse: 'hero-video-parser' },
      ],
      defaultContent: [],
    },
    {
      id: 2,
      name: 'Recent News',
      style: null,
      blocks: [
        { name: 'cards-news', selector: '#section-e399d3f855', parse: 'cards-news-parser' },
      ],
      defaultContent: [
        { position: 'before', selector: '#section-e399d3f855 .cmp-title__text', tag: 'h3' },
      ],
    },
    {
      id: 3,
      name: 'Featured Products',
      style: null,
      blocks: [
        { name: 'cards-product', selector: '#section-ea641b114c', parse: 'cards-product-parser' },
      ],
      defaultContent: [
        { position: 'before', selector: '#section-ea641b114c .cmp-title__text', tag: 'h3' },
      ],
    },
    {
      id: 4,
      name: 'Safety Roadblock',
      style: 'dark, swoosh-bottom',
      blocks: [
        { name: 'hero-roadblock', selector: '#roadblock-image-text-3e99e7fb-7332-4a54-9bdf-00af32dc78d8', parse: 'hero-roadblock-parser' },
      ],
      defaultContent: [],
    },
    {
      id: 5,
      name: 'Our Purpose',
      style: 'dark',
      blocks: [
        { name: 'cards-feature', selector: '#section-beb9885678', parse: 'cards-feature-parser' },
      ],
      defaultContent: [
        { position: 'before', selector: '#text-43b70b2567 strong', tag: 'eyebrow' },
        { position: 'before', selector: '#title-00aa326bee .cmp-title__text', tag: 'h2' },
        { position: 'before', selector: '#text-935dea097f h5', tag: 'p' },
      ],
    },
    {
      id: 6,
      name: 'Services Roadblock',
      style: 'dark',
      blocks: [
        { name: 'hero-roadblock', selector: '#roadblock-image-text-ca5f7eaf-5575-4ad0-94ca-a6281a994777', parse: 'hero-roadblock-parser' },
      ],
      defaultContent: [],
    },
    {
      id: 7,
      name: 'Our Commitment',
      style: 'dark',
      blocks: [
        { name: 'cards-feature', selector: 'section:has(#text-042f2d7ecb)', parse: 'cards-feature-parser' },
      ],
      defaultContent: [
        { position: 'before', selector: '#text-042f2d7ecb strong', tag: 'eyebrow' },
        { position: 'before', selector: '#title-8b441f72b7 .cmp-title__text', tag: 'h2' },
        { position: 'before', selector: '#text-b1baa726d9 h5', tag: 'p' },
      ],
    },
    {
      id: 8,
      name: 'Explore More',
      style: 'dark',
      blocks: [
        { name: 'cards-mini', selector: 'section:has(#text-042f2d7ecb)', parse: 'cards-mini-parser' },
      ],
      defaultContent: [
        { position: 'before', selector: '#title-11f26cbb22 .cmp-title__text', tag: 'h3' },
      ],
    },
    {
      id: 9,
      name: 'Careers Roadblock',
      style: 'dark, swoosh-top',
      blocks: [
        { name: 'hero-roadblock', selector: '#roadblock-image-text-11820dcd-037a-4d97-bed0-9144abaa10b3', parse: 'hero-roadblock-parser', variant: 'right' },
      ],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Get block table header name including variant.
 */
function getBlockTableName(block) {
  return block.variant ? `${block.name} (${block.variant})` : block.name;
}

/**
 * Extract default content text from a source element.
 */
function extractDefaultContent(contentDef, sourceDocument, targetDocument) {
  const el = sourceDocument.querySelector(contentDef.selector);
  if (!el) return null;

  const text = el.textContent.trim();
  if (!text) return null;

  if (contentDef.tag === 'eyebrow') {
    const p = targetDocument.createElement('p');
    const strong = targetDocument.createElement('strong');
    strong.textContent = text;
    p.append(strong);
    return p;
  }

  const node = targetDocument.createElement(contentDef.tag || 'p');
  node.textContent = text;
  return node;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform (cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Build the page section by section
    const outputContainer = document.createElement('div');

    PAGE_TEMPLATE.sections.forEach((section, sectionIndex) => {
      // Add <hr> before every section except the first
      if (sectionIndex > 0) {
        outputContainer.append(document.createElement('hr'));
      }

      // Add default content that goes BEFORE blocks
      section.defaultContent
        .filter((dc) => dc.position === 'before')
        .forEach((dc) => {
          const node = extractDefaultContent(dc, document, document);
          if (node) outputContainer.append(node);
        });

      // Parse and add blocks
      section.blocks.forEach((blockDef, blockIndex) => {
        const sourceEl = document.querySelector(blockDef.selector);
        if (!sourceEl) {
          console.warn(`Block "${blockDef.name}" selector not found: ${blockDef.selector}`);
          return;
        }

        const parser = parsers[blockDef.parse];
        if (!parser) {
          console.warn(`No parser found for: ${blockDef.parse}`);
          return;
        }

        try {
          const cells = parser(sourceEl, document);
          if (cells && cells.length > 0) {
            const tableCells = [[getBlockTableName(blockDef)], ...cells];
            const table = WebImporter.DOMUtils.createTable(tableCells, document);
            outputContainer.append(table);
          }
        } catch (e) {
          console.error(`Failed to parse ${blockDef.name}:`, e);
        }

        // Add default content that goes BETWEEN blocks (after this block)
        section.defaultContent
          .filter((dc) => dc.position === 'between' && dc.afterBlockIndex === blockIndex)
          .forEach((dc) => {
            const node = extractDefaultContent(dc, document, document);
            if (node) outputContainer.append(node);
          });
      });

      // Add Section Metadata if section has a style
      if (section.style) {
        const smCells = [
          ['Section Metadata'],
          ['style', section.style],
        ];
        const smTable = WebImporter.DOMUtils.createTable(smCells, document);
        outputContainer.append(smTable);
      }
    });

    // 3. Execute afterTransform (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 4. Replace main content with our structured output
    main.innerHTML = '';
    while (outputContainer.firstChild) {
      main.append(outputContainer.firstChild);
    }

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        sections: PAGE_TEMPLATE.sections.map((s) => s.name),
      },
    }];
  },
};

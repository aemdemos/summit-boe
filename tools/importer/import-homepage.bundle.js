var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video-parser.js
  function parse(el, document) {
    const cells = [];
    const posterImg = el.querySelector(".cmp-image__image, .cmp-jumbotron img");
    const headline = el.querySelector(".jumbotron-content h1, .cmp-teaser__title");
    const mediaCell = [];
    if (posterImg) {
      const img = document.createElement("img");
      img.src = posterImg.src;
      img.alt = posterImg.alt || "";
      mediaCell.push(img);
    }
    const textCell = [];
    if (headline) {
      const h1 = document.createElement("h1");
      h1.textContent = headline.textContent.trim();
      textCell.push(h1);
    }
    cells.push([mediaCell, textCell]);
    return cells;
  }

  // tools/importer/parsers/hero-roadblock-parser.js
  function parse2(el, document) {
    var _a;
    const cells = [];
    const desktopImg = el.querySelector(".cmp-image__image.image-mobile-active, .cmp-image__image:not(.cmp-mobile-image)");
    const mobileImg = el.querySelector(".cmp-mobile-image");
    const title = el.querySelector(".roadblock-title");
    const description = el.querySelector(".roadblock-description p");
    const ctaLink = el.querySelector(".roadblock-text-content .cmp-button");
    const mediaCell = [];
    if (desktopImg) {
      const img = document.createElement("img");
      img.src = desktopImg.src;
      img.alt = desktopImg.alt || "";
      mediaCell.push(img);
    }
    if (mobileImg) {
      mediaCell.push(document.createElement("br"));
      const img = document.createElement("img");
      img.src = mobileImg.src;
      img.alt = mobileImg.alt || "";
      mediaCell.push(img);
    }
    const textCell = [];
    if (title) {
      const h4 = document.createElement("h4");
      h4.textContent = title.textContent.trim();
      textCell.push(h4);
    }
    if (description && description.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }
    if (ctaLink) {
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ((_a = ctaLink.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent.trim()) || "Learn More";
      const p = document.createElement("p");
      p.append(a);
      textCell.push(p);
    }
    cells.push([mediaCell, textCell]);
    return cells;
  }

  // tools/importer/parsers/cards-news-parser.js
  function parse3(el, document) {
    const cells = [];
    const featureCard = el.querySelector(".lockupFeatureLarge .cmp-card, .cmp-card__feature-large");
    if (featureCard) {
      cells.push(parseCard(featureCard, document));
    }
    const tileCards = el.querySelectorAll(".d-none.d-lg-block .lockupTileStory .cmp-card, .col-lg-6:not(.lockupFeatureLarge) .lockupTileStory .cmp-card");
    tileCards.forEach((card) => {
      cells.push(parseCard(card, document));
    });
    return cells;
  }
  function parseCard(card, document) {
    var _a;
    const img = card.querySelector(".cmp-image__image");
    const title = card.querySelector(".cmp-card__title");
    const link = card.querySelector(".cmp-button, .cmp-card__link");
    const mediaCell = [];
    if (img) {
      const imgEl = document.createElement("img");
      imgEl.src = img.src;
      imgEl.alt = img.alt || "";
      mediaCell.push(imgEl);
    }
    const textCell = [];
    if (title) {
      const heading = document.createElement("h4");
      heading.textContent = title.textContent.trim();
      textCell.push(heading);
    }
    if (link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = ((_a = link.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent.trim()) || link.textContent.trim() || "Read more";
      const p = document.createElement("p");
      p.append(a);
      textCell.push(p);
    }
    return [mediaCell, textCell];
  }

  // tools/importer/parsers/cards-product-parser.js
  function parse4(el, document) {
    const cells = [];
    const cards = el.querySelectorAll(".cmp-card__feature-small, .featureSmall .cmp-card");
    cards.forEach((card) => {
      var _a;
      const img = card.querySelector(".cmp-image__image");
      const pretitle = card.querySelector(".cmp-card__pretitle");
      const title = card.querySelector(".cmp-card__title");
      const link = card.querySelector(".cmp-button");
      const mediaCell = [];
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        mediaCell.push(imgEl);
      }
      const textCell = [];
      if (pretitle) {
        const p = document.createElement("p");
        p.textContent = pretitle.textContent.trim();
        textCell.push(p);
      }
      if (title) {
        const h4 = document.createElement("h4");
        h4.textContent = title.textContent.trim();
        textCell.push(h4);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = ((_a = link.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent.trim()) || "Product Info";
        const p = document.createElement("p");
        p.append(a);
        textCell.push(p);
      }
      cells.push([mediaCell, textCell]);
    });
    return cells;
  }

  // tools/importer/parsers/cards-feature-parser.js
  function parse5(el, document) {
    const cells = [];
    const cards = el.querySelectorAll(".cmp-card__feature-medium, .featureMedium .cmp-card");
    cards.forEach((card) => {
      var _a;
      const img = card.querySelector(".cmp-image__image");
      const title = card.querySelector(".cmp-card__title");
      const desc = card.querySelector(".card-text p");
      const link = card.querySelector(".cmp-button");
      const mediaCell = [];
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        mediaCell.push(imgEl);
      }
      const textCell = [];
      if (title) {
        const h4 = document.createElement("h4");
        h4.textContent = title.textContent.trim();
        textCell.push(h4);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = ((_a = link.querySelector(".cmp-button__text")) == null ? void 0 : _a.textContent.trim()) || "Learn More";
        const p = document.createElement("p");
        p.append(a);
        textCell.push(p);
      }
      cells.push([mediaCell, textCell]);
    });
    return cells;
  }

  // tools/importer/parsers/cards-mini-parser.js
  function parse6(el, document) {
    const cells = [];
    const cards = el.querySelectorAll(".cmp-card__mini");
    cards.forEach((card) => {
      const img = card.querySelector(".cmp-image__image");
      const title = card.querySelector(".cmp-card__title");
      const link = card.querySelector(".cmp-card__link-mini");
      const mediaCell = [];
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        mediaCell.push(imgEl);
      }
      const textCell = [];
      if (title && link) {
        const h5 = document.createElement("h5");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = title.textContent.trim();
        h5.append(a);
        textCell.push(h5);
      } else if (title) {
        const h5 = document.createElement("h5");
        h5.textContent = title.textContent.trim();
        textCell.push(h5);
      }
      cells.push([mediaCell, textCell]);
    });
    return cells;
  }

  // tools/importer/transformers/homepage-transformer.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        '[class*="cookie"]'
      ]);
      const trackingImgs = element.querySelectorAll('img[src*="metrics.brightcove.com"]');
      trackingImgs.forEach((img) => img.remove());
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        // Header and navigation
        "header.experiencefragment",
        ".experiencefragment.global-page-header",
        "#mainNavigationHolder",
        "#headerTop",
        "#utilityNav",
        "#meganavHolder",
        "#scrollChecker",
        ".experiencefragment.header-alert-bar",
        // Footer
        "footer.experiencefragment",
        ".cmp-experiencefragment--footer-with-sub-footer",
        ".cmp-experiencefragment--footer",
        // Sticky nav
        ".sticky-anchor-nav",
        // Scripts, iframes, link tags
        "iframe",
        "link",
        "noscript",
        // Stock/decorative images from footer
        ".footer-earth",
        ".stock-img"
      ]);
      element.querySelectorAll("[data-cmp-data-layer-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer-enabled");
      });
      element.querySelectorAll("[data-cmp-link-accessibility-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-link-accessibility-enabled");
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video-parser": parse,
    "hero-roadblock-parser": parse2,
    "cards-news-parser": parse3,
    "cards-product-parser": parse4,
    "cards-feature-parser": parse5,
    "cards-mini-parser": parse6
  };
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Boeing homepage",
    urls: ["https://www.boeing.com/"],
    sections: [
      {
        id: 1,
        name: "Hero Video",
        style: null,
        blocks: [
          { name: "hero-video", selector: ".jumbotron.teaser", parse: "hero-video-parser" }
        ],
        defaultContent: []
      },
      {
        id: 2,
        name: "Recent News",
        style: null,
        blocks: [
          { name: "cards-news", selector: "#section-e399d3f855", parse: "cards-news-parser" }
        ],
        defaultContent: [
          { position: "before", selector: "#section-e399d3f855 .cmp-title__text", tag: "h3" }
        ]
      },
      {
        id: 3,
        name: "Featured Products",
        style: null,
        blocks: [
          { name: "cards-product", selector: "#section-ea641b114c", parse: "cards-product-parser" }
        ],
        defaultContent: [
          { position: "before", selector: "#section-ea641b114c .cmp-title__text", tag: "h3" }
        ]
      },
      {
        id: 4,
        name: "Safety Roadblock",
        style: "dark",
        blocks: [
          { name: "hero-roadblock", selector: "#roadblock-image-text-3e99e7fb-7332-4a54-9bdf-00af32dc78d8", parse: "hero-roadblock-parser" }
        ],
        defaultContent: []
      },
      {
        id: 5,
        name: "Our Purpose",
        style: "dark",
        blocks: [
          { name: "cards-feature", selector: "#section-beb9885678", parse: "cards-feature-parser" }
        ],
        defaultContent: [
          { position: "before", selector: "#text-43b70b2567 strong", tag: "eyebrow" },
          { position: "before", selector: "#title-00aa326bee .cmp-title__text", tag: "h2" },
          { position: "before", selector: "#text-935dea097f h5", tag: "p" }
        ]
      },
      {
        id: 6,
        name: "Services Roadblock",
        style: null,
        blocks: [
          { name: "hero-roadblock", selector: "#roadblock-image-text-ca5f7eaf-5575-4ad0-94ca-a6281a994777", parse: "hero-roadblock-parser" }
        ],
        defaultContent: []
      },
      {
        id: 7,
        name: "Our Commitment",
        style: "dark",
        blocks: [
          { name: "cards-feature", selector: "section:has(#text-042f2d7ecb)", parse: "cards-feature-parser" },
          { name: "cards-mini", selector: "section:has(#text-042f2d7ecb)", parse: "cards-mini-parser" }
        ],
        defaultContent: [
          { position: "before", selector: "#text-042f2d7ecb strong", tag: "eyebrow" },
          { position: "before", selector: "#title-8b441f72b7 .cmp-title__text", tag: "h2" },
          { position: "before", selector: "#text-b1baa726d9 h5", tag: "p" },
          { position: "between", selector: "#title-11f26cbb22 .cmp-title__text", tag: "h4", afterBlockIndex: 0 }
        ]
      },
      {
        id: 8,
        name: "Careers Roadblock",
        style: "dark",
        blocks: [
          { name: "hero-roadblock", selector: "#roadblock-image-text-11820dcd-037a-4d97-bed0-9144abaa10b3", parse: "hero-roadblock-parser", variant: "right" }
        ],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function getBlockTableName(block) {
    return block.variant ? `${block.name} (${block.variant})` : block.name;
  }
  function extractDefaultContent(contentDef, sourceDocument, targetDocument) {
    const el = sourceDocument.querySelector(contentDef.selector);
    if (!el) return null;
    const text = el.textContent.trim();
    if (!text) return null;
    if (contentDef.tag === "eyebrow") {
      const p = targetDocument.createElement("p");
      const strong = targetDocument.createElement("strong");
      strong.textContent = text;
      p.append(strong);
      return p;
    }
    const node = targetDocument.createElement(contentDef.tag || "p");
    node.textContent = text;
    return node;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const outputContainer = document.createElement("div");
      PAGE_TEMPLATE.sections.forEach((section, sectionIndex) => {
        if (sectionIndex > 0) {
          outputContainer.append(document.createElement("hr"));
        }
        section.defaultContent.filter((dc) => dc.position === "before").forEach((dc) => {
          const node = extractDefaultContent(dc, document, document);
          if (node) outputContainer.append(node);
        });
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
          section.defaultContent.filter((dc) => dc.position === "between" && dc.afterBlockIndex === blockIndex).forEach((dc) => {
            const node = extractDefaultContent(dc, document, document);
            if (node) outputContainer.append(node);
          });
        });
        if (section.style) {
          const smCells = [
            ["Section Metadata"],
            ["style", section.style]
          ];
          const smTable = WebImporter.DOMUtils.createTable(smCells, document);
          outputContainer.append(smTable);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.innerHTML = "";
      while (outputContainer.firstChild) {
        main.append(outputContainer.firstChild);
      }
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          sections: PAGE_TEMPLATE.sections.map((s) => s.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

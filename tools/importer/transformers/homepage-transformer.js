/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Boeing homepage cleanup.
 * Removes non-authorable content (header, footer, nav, cookie banners, etc.)
 * Selectors from captured DOM of https://www.boeing.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent and tracking overlays (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '[class*="cookie"]',
    ]);

    // Remove video tracking pixels (brightcove metrics)
    const trackingImgs = element.querySelectorAll('img[src*="metrics.brightcove.com"]');
    trackingImgs.forEach((img) => img.remove());
  }

  if (hookName === H.after) {
    // Remove non-authorable global chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      // Header and navigation
      'header.experiencefragment',
      '.experiencefragment.global-page-header',
      '#mainNavigationHolder',
      '#headerTop',
      '#utilityNav',
      '#meganavHolder',
      '#scrollChecker',
      '.experiencefragment.header-alert-bar',

      // Footer
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer-with-sub-footer',
      '.cmp-experiencefragment--footer',

      // Sticky nav
      '.sticky-anchor-nav',

      // Scripts, iframes, link tags
      'iframe',
      'link',
      'noscript',

      // Stock/decorative images from footer
      '.footer-earth',
      '.stock-img',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('[data-cmp-data-layer-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer-enabled');
    });
    element.querySelectorAll('[data-cmp-link-accessibility-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-link-accessibility-enabled');
    });
  }
}

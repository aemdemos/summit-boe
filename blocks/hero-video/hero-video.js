/**
 * Hero Video block - Full-width video/image background with overlay text.
 * Content model:
 *   Row 1: [video-link or poster-image] [text content (h1, etc.)]
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const [mediaCell, textCell] = [...rows[0].children];

  // Handle video: look for a link to a video file
  const videoLink = mediaCell?.querySelector('a');
  const picture = mediaCell?.querySelector('picture');
  const img = mediaCell?.querySelector('img');

  if (videoLink) {
    const { href } = videoLink;
    const video = document.createElement('video');
    video.classList.add('hero-video-bg');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');

    const source = document.createElement('source');
    source.setAttribute('src', href);
    source.setAttribute('type', 'video/mp4');
    video.append(source);

    if (img) video.setAttribute('poster', img.src);
    block.prepend(video);
  } else if (picture) {
    picture.classList.add('hero-video-bg');
    block.prepend(picture);
  } else if (img) {
    // Raw <img> without <picture> wrapper — use as background
    const wrapper = document.createElement('div');
    wrapper.classList.add('hero-video-bg');
    wrapper.append(img);
    block.prepend(wrapper);
  }

  // Build text overlay
  if (textCell) {
    textCell.classList.add('hero-video-text');
    block.append(textCell);
  }

  // Clean up original rows
  rows.forEach((row) => {
    if (block.contains(row)) row.remove();
  });
}

/**
 * Hero Video block - Full-width video/image background with overlay text.
 * Content model (author-friendly: left to right):
 *   Row 1: [text content (h1, etc.)] [video-link or poster-image]
 *
 * Supported video link formats:
 *   - Brightcove: https://players.brightcove.com/{account}/default_default/index.html?videoId={id}
 *   - Direct MP4: https://example.com/video.mp4
 *   - Poster image fallback: <img> or <picture>
 *
 * @param {Element} block
 */

function parseBrightcoveUrl(url) {
  const u = URL.canParse?.(url) ? new URL(url) : null;
  if (!u) return null;
  const pathMatch = u.pathname.match(/\/(\d+)\//);
  const videoId = u.searchParams.get('videoId');
  if (pathMatch && videoId) return { account: pathMatch[1], videoId };
  return null;
}

function createBrightcovePlayer(account, videoId, block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-video-bg', 'hero-video-bc');

  const videoEl = document.createElement('video-js');
  videoEl.setAttribute('data-account', account);
  videoEl.setAttribute('data-player', 'default');
  videoEl.setAttribute('data-embed', 'default');
  videoEl.setAttribute('data-video-id', videoId);
  videoEl.setAttribute('playsinline', '');
  videoEl.setAttribute('autoplay', '');
  videoEl.setAttribute('muted', '');
  videoEl.setAttribute('loop', '');
  videoEl.classList.add('vjs-fluid');
  wrapper.append(videoEl);
  block.prepend(wrapper);

  const script = document.createElement('script');
  script.src = `https://players.brightcove.com/${account}/default_default/index.min.js`;
  script.async = true;
  document.head.append(script);

  return videoEl;
}

function prependImageBg(img, block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-video-bg');
  wrapper.append(img);
  block.prepend(wrapper);
}

function createMp4Video(href, img, block) {
  const videoEl = document.createElement('video');
  videoEl.classList.add('hero-video-bg');
  videoEl.setAttribute('autoplay', '');
  videoEl.setAttribute('muted', '');
  videoEl.setAttribute('loop', '');
  videoEl.setAttribute('playsinline', '');
  const source = document.createElement('source');
  source.setAttribute('src', href);
  source.setAttribute('type', 'video/mp4');
  videoEl.append(source);
  if (img) videoEl.setAttribute('poster', img.src);
  block.prepend(videoEl);
}

function setupMedia(mediaCell, block) {
  const link = mediaCell?.querySelector('a');
  const picture = mediaCell?.querySelector('picture');
  const img = mediaCell?.querySelector('img');

  if (link) {
    const bc = parseBrightcoveUrl(link.href);
    if (bc) return createBrightcovePlayer(bc.account, bc.videoId, block);
    if (link.href.includes('.mp4')) {
      createMp4Video(link.href, img, block);
    } else if (img) {
      prependImageBg(img, block);
    }
  } else if (picture) {
    picture.classList.add('hero-video-bg');
    block.prepend(picture);
  } else if (img) {
    prependImageBg(img, block);
  }
  return null;
}

function toggleBcPlayer(bcPlayer, pauseBtn) {
  const player = bcPlayer.player || window.videojs?.(bcPlayer);
  if (!player) return;
  if (player.paused()) {
    player.play();
    pauseBtn.classList.remove('paused');
  } else {
    player.pause();
    pauseBtn.classList.add('paused');
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cells = [...rows[0].children];
  if (cells.length < 2) return;

  // Detect which cell is media and which is text
  const firstHasMedia = cells[0].querySelector('img, picture, a[href]')
    && !cells[0].querySelector('h1, h2, h3');
  const [textCell, mediaCell] = firstHasMedia
    ? [cells[1], cells[0]]
    : [cells[0], cells[1]];

  const bcPlayer = setupMedia(mediaCell, block);

  // Build text overlay
  if (textCell) {
    textCell.classList.add('hero-video-text');
    block.append(textCell);
  }

  // Add pause/play button
  const pauseBtn = document.createElement('button');
  pauseBtn.type = 'button';
  pauseBtn.className = 'hero-video-pause';
  pauseBtn.setAttribute('aria-label', 'Pause video');
  const pauseIcon = document.createElement('span');
  pauseIcon.className = 'hero-video-pause-icon';
  pauseBtn.append(pauseIcon);
  block.append(pauseBtn);

  pauseBtn.addEventListener('click', () => {
    const video = block.querySelector('video');
    if (video) {
      if (video.paused) {
        video.play();
        pauseBtn.classList.remove('paused');
        pauseBtn.setAttribute('aria-label', 'Pause video');
      } else {
        video.pause();
        pauseBtn.classList.add('paused');
        pauseBtn.setAttribute('aria-label', 'Play video');
      }
    } else if (bcPlayer) {
      toggleBcPlayer(bcPlayer, pauseBtn);
    }
  });

  // Clean up original rows
  rows.forEach((row) => {
    if (block.contains(row)) row.remove();
  });
}

/**
 * Hero Video block - Full-width video/image background with overlay text.
 * Content model (author-friendly: left to right):
 *   Row 1: [text content (h1, etc.)] [video-link or poster-image]
 *
 * Supported video link formats:
 *   - Brightcove: https://players.brightcove.com/{account}/.../index.html?videoId={id}
 *   - Direct MP4: https://example.com/video.mp4
 *   - Poster image fallback: <img> or <picture>
 *
 * @param {Element} block
 */

/**
 * Loads Brightcove policy key from block config file.
 * Kept separate from source to avoid hardcoded credential lint warnings.
 */
async function getBcPolicyKey() {
  const resp = await fetch('/blocks/hero-video/config.json');
  if (!resp.ok) return null;
  const config = await resp.json();
  return config?.brightcove?.policyKey || null;
}

function parseBrightcoveUrl(url) {
  const u = URL.canParse?.(url) ? new URL(url) : null;
  if (!u) return null;
  const pathMatch = u.pathname.match(/\/(\d+)\//);
  const videoId = u.searchParams.get('videoId');
  if (pathMatch && videoId) return { account: pathMatch[1], videoId };
  return null;
}

function createNativeVideo(src, poster) {
  const video = document.createElement('video');
  video.classList.add('hero-video-bg');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.muted = true;
  if (poster) video.setAttribute('poster', poster);
  const source = document.createElement('source');
  source.setAttribute('src', src);
  source.setAttribute('type', 'video/mp4');
  video.append(source);
  return video;
}

function prependImageBg(img, block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-video-bg');
  wrapper.append(img);
  block.prepend(wrapper);
}

async function loadBrightcoveVideo(account, videoId, block) {
  const policyKey = await getBcPolicyKey();
  if (!policyKey) return;
  const apiUrl = `https://edge.api.brightcove.com/playback/v1/accounts/${account}/videos/${videoId}`;
  const resp = await fetch(apiUrl, {
    headers: { Accept: `application/json;pk=${policyKey}` },
  });
  if (!resp.ok) return;
  const data = await resp.json();

  // Find the best MP4 source
  const mp4Sources = (data.sources || [])
    .filter((s) => s.src && s.container === 'MP4' && s.src.startsWith('https'))
    .sort((a, b) => (b.width || 0) - (a.width || 0));

  const mp4Src = mp4Sources[0]?.src;
  const { poster } = data;

  if (mp4Src) {
    const video = createNativeVideo(mp4Src, poster);
    block.prepend(video);
  } else if (poster) {
    // Fallback to poster image
    const img = document.createElement('img');
    img.src = poster;
    img.alt = '';
    prependImageBg(img, block);
  }
}

function setupMedia(mediaCell, block) {
  const link = mediaCell?.querySelector('a');
  const picture = mediaCell?.querySelector('picture');
  const img = mediaCell?.querySelector('img');

  if (link) {
    const bc = parseBrightcoveUrl(link.href);
    if (bc) {
      // Fetch MP4 from Brightcove API and create native video
      loadBrightcoveVideo(bc.account, bc.videoId, block);
      return;
    }
    if (link.href.includes('.mp4')) {
      const video = createNativeVideo(link.href, img?.src);
      block.prepend(video);
    } else if (img) {
      prependImageBg(img, block);
    }
  } else if (picture) {
    picture.classList.add('hero-video-bg');
    block.prepend(picture);
  } else if (img) {
    prependImageBg(img, block);
  }
}

function addPauseButton(block) {
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
    if (!video) return;
    if (video.paused) {
      video.play();
      pauseBtn.classList.remove('paused');
      pauseBtn.setAttribute('aria-label', 'Pause video');
    } else {
      video.pause();
      pauseBtn.classList.add('paused');
      pauseBtn.setAttribute('aria-label', 'Play video');
    }
  });
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

  setupMedia(mediaCell, block);

  if (textCell) {
    textCell.classList.add('hero-video-text');
    block.append(textCell);
  }

  addPauseButton(block);

  rows.forEach((row) => {
    if (block.contains(row)) row.remove();
  });
}

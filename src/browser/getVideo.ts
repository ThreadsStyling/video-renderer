const videoContainer = document.createElement('div');

videoContainer.style.position = 'fixed';
videoContainer.style.top = '0';
videoContainer.style.left = '0';
videoContainer.style.width = '1px';
videoContainer.style.height = '1px';
videoContainer.style.pointerEvents = 'none';
videoContainer.style.opacity = '0.000001';
document.body.appendChild(videoContainer);

export default async function getVideo (src: string) {
  const video = document.createElement('video');

  await new Promise((resolve, reject) => {
    video.addEventListener('error', (err) => reject(err), false);
    video.addEventListener('loadedmetadata', () => resolve(), false);
    videoContainer.appendChild(video);
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.style.width = '1px';
    video.style.height = '1px';
    video.controls = false;
    video.src = src;
    video.setAttribute('playsinline', '');
  });

  return video;
}

const videoContainer = document.createElement('div');
videoContainer.style.position = 'absolute';
videoContainer.style.top = '50vh';
videoContainer.style.left = '50vw';
videoContainer.style.pointerEvents = 'none';
videoContainer.style.opacity = '0.000001';
document.body.appendChild(videoContainer);

export default async function getVideo(videoURL: string) {
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
    video.controls = true;
    video.src = videoURL;
    video.setAttribute('playsinline', 'playsinline');
  });
  return video;
}

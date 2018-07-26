const videoContainer = document.createElement('div');
videoContainer.style.position = 'absolute';
videoContainer.style.pointerEvents = 'none';
videoContainer.style.opacity = '0.01';
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
    video.style.width = '0px';
    video.style.height = '0px';
    video.src = videoURL;
  });
  return video;
}

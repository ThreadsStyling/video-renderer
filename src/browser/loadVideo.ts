const videoContainer = document.createElement('div');
videoContainer.style.opacity = '0';
videoContainer.style.position = 'absolute';
videoContainer.style.width = '0';
videoContainer.style.height = '0';
document.body.appendChild(videoContainer);

export default async function getVideo(videoURL: string) {
  const video = document.createElement('video');
  await new Promise((resolve, reject) => {
    video.addEventListener('error', (err) => reject(err), false);
    video.addEventListener('loadedmetadata', () => resolve(), false);
    videoContainer.appendChild(video);
    video.autoplay = true;
    video.loop = true;
    video.src = videoURL;
  });
  return video;
}

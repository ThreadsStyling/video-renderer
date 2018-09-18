import Asset from './Asset';
import getVideo from './util/loadVideo';
import createCanvasAndContext from './util/createCanvasAndContext';


export const loadVideo = async (url: string): Promise<Asset> => {
  const [canvas, context] = createCanvasAndContext();
  const video = await getVideo(url);

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let seeking = false;

  return new Asset(video.duration, video.videoWidth, video.videoHeight, canvas, context, (timestamp) => {
    const t = timestamp % video.duration;
    if (Math.abs(video.currentTime - t) > 0.2 && !seeking && video.seekable) {
      seeking = true;
      setTimeout(() => {
        seeking = false;
      }, 100);
      for (let i = 0; i < video.seekable.length; i++) {
        if (video.seekable.start(i) < t && video.seekable.end(i) > t) {
          video.currentTime = t;
          break;
        }
      }
    }
    context.drawImage(video, 0, 0);
  });
};

export const loadVideoWithAlpha = async (url: string): Promise<Asset> => {
  const fullVideo = await loadVideo(url);
  const width = fullVideo.width;
  const height = fullVideo.height / 2;
  const [canvas, context] = createCanvasAndContext();

  canvas.width = width;
  canvas.height = height;

  const rawFrame = fullVideo.context;

  return new Asset(fullVideo.duration, width, height, canvas, context, (timestamp) => {
    fullVideo.renderFrame(timestamp);
    const image = rawFrame.getImageData(0, 0, width, height);
    const imageData = image.data;
    const alphaData = rawFrame.getImageData(0, height, width, height).data;

    for (let i = 3; i < imageData.length; i += 4) {
      imageData[i] = alphaData[i - 1];
    }
    context.putImageData(image, 0, 0, 0, 0, width, height);
  });
};

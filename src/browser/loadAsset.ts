import AssetKind from './AssetKind';
import Asset from './Asset';
import getVideo from './getVideo';
import getImage from './getImage';

const createCanvasAndContext = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (!context) {
    throw new Error('Could not get canvas context.');
  }

  return [canvas, context];
};

const loadVideo = async (url: string): Promise<Asset> => {
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

const loadVideoWithAlpha = async (url: string): Promise<Asset> => {
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

const noop = () => {};
const loadImage = async (src: string): Promise<Asset> => {
  const [canvas, context] = createCanvasAndContext();
  const img = await getImage(src);
  const width = img.width;
  const height = img.height;

  canvas.width = width;
  canvas.height = height;
  context.drawImage(img, 0, 0);

  return new Asset(0, width, height, canvas, context, noop);
};

export default async function loadAsset(url: string, kind: AssetKind): Promise<Asset> {
  switch (kind) {
    case AssetKind.Video:
      return loadVideo(url);
    case AssetKind.VideoWithAlpha:
      return loadVideoWithAlpha(url);
    case AssetKind.Image:
      return loadImage(url);
  }
}

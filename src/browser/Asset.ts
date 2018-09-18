import createCanvasAndContext from './util/createCanvasAndContext';
import loadImage from './util/loadImage';
import loadVideo from './util/loadVideo';

const noop = () => {};

export default class Asset {
  static async fromImage(src: string): Promise<Asset> {
    const [canvas, context] = createCanvasAndContext();
    const img = await loadImage(src);
    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(img, 0, 0);

    return new Asset(0, width, height, canvas, context, noop);
  }

  static async fromVideo(src: string): Promise<Asset> {
    const [canvas, context] = createCanvasAndContext();
    const video = await loadVideo(src);

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
  }

  static async fromVideoWithAlpha(src: string): Promise<Asset> {
    const fullVideo = await Asset.fromVideo(src);
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
  }

  duration: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  renderFrame: (time: number) => void;

  constructor(
    duration: number,
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    renderFrame: (time: number) => void,
  ) {
    this.duration = duration;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.context = context;
    this.renderFrame = renderFrame;
  }
}

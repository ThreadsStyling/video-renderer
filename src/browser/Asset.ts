import loadImage from './util/loadImage';
import createCanvasAndContext from './util/createCanvasAndContext';

const noop = () => {};

export default class Asset {
  static async fromImage (src: string): Promise<Asset> {
    const [canvas, context] = createCanvasAndContext();
    const img = await loadImage(src);
    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(img, 0, 0);

    return new Asset(0, width, height, canvas, context, noop);
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

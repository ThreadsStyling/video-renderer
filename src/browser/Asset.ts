export default class Asset {
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

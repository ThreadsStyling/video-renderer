import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

/**
 * @param sCanvas Source <canvas>.
 * @param sContext Context of source <canvas>.
 * @param rotation Rotation amount in Radians.
 */
const getRotatedCanvasAndContext = (sCanvas: HTMLCanvasElement, width: number, height: number, angle: number, background: string): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const [canvas, context] = createCanvasAndContext();

  canvas.width = width;
  canvas.height = height

  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.translate(width / 2, height / 2);
  context.rotate(1);
  context.drawImage(sCanvas, -sCanvas.width / 2, -sCanvas.height / 2);

  return [canvas, context];
}

const rotate: Filter = ([asset], {angle, out_w, out_h, fillcolor = '#000000'}) => {
  const [canvas, context] = createCanvasAndContext();
  const outWidth = out_w ? out_w as any | 0 : asset.width;
  const outHeight = out_h ? out_h as any | 0 : asset.height;

  canvas.width = outWidth;
  canvas.height = outHeight;

  const render = (time: number) => {
    asset.renderFrame(time);

    const [rotatedCanvas] = getRotatedCanvasAndContext(asset.canvas, outWidth, outHeight, angle as any | 0, fillcolor as string);

    context.clearRect(0, 0, outWidth, outHeight);
    context.drawImage(rotatedCanvas, 0, 0);
  };

  return [
    new Asset(
      asset.duration,
      canvas.width,
      canvas.height,
      canvas,
      context,
      render,
    ),
  ];
};

export default rotate;

import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

/**
 * @param sCanvas Source <canvas>.
 * @param sContext Context of source <canvas>.
 * @param rotation Rotation amount in Radians.
 */
const getRotatedCanvasAndContext = (sCanvas: HTMLCanvasElement, sContext: CanvasRenderingContext2D, rotation: number): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const [canvas, context] = createCanvasAndContext();
  const max = Math.max(sCanvas.width, sCanvas.height);
  const size = Math.ceil(Math.sqrt(2 * max * max));

  canvas.width = size;
  canvas.height = size;

  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(rotation);
  context.drawImage(sCanvas, -sCanvas.width / 2, -sCanvas.height / 2);
  context.restore();

  return [canvas, context];
}

const rotate: Filter = ([asset], {angle}) => {
  const [canvas, context] = createCanvasAndContext();
  const max = Math.max(asset.width, asset.height);
  const size = Math.ceil(Math.sqrt(2 * max * max));

  canvas.width = size;
  canvas.height = size;
  // rotateCanvas(asset.canvas, canvas, context, angle as any | 0);

  const render = (time: number) => {
    asset.renderFrame(time);

    const [rotatedCanvas] = getRotatedCanvasAndContext(asset.canvas, asset.context, angle as any | 0);

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

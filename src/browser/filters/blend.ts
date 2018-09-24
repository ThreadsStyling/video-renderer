import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const blend: Filter = ([asset1, asset2], {c0_mode}) => {
  const [canvas, context] = createCanvasAndContext();
  const {width, height} = asset1;

  canvas.width = width;
  canvas.height = height;

  const render = (time: number) => {
    asset1.renderFrame(time);
    asset2.renderFrame(time);

    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
    context.drawImage(asset2.canvas, 0, 0);
    context.globalCompositeOperation = String(c0_mode);
    context.drawImage(asset1.canvas, 0, 0);
  };

  return [
    new Asset(
      asset1.duration,
      width,
      height,
      canvas,
      context,
      render,
    ),
  ];
};

export default blend;

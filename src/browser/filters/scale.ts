import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const scale: Filter = ([asset], {w, h}) => {
  const [canvas, context] = createCanvasAndContext();

  canvas.width = w as any | 0;
  canvas.height = h as any | 0;

  const render = (time: number) => {
    asset.renderFrame(time);
    context.drawImage(asset.canvas, 0, 0, asset.width, asset.height, 0, 0, canvas.width, canvas.height);
  };

  return [new Asset(asset.duration, canvas.width, canvas.height, canvas, context, render)];
};

export default scale;

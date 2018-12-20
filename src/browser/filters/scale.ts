import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const scale: Filter = ([asset], {w, h}) => {
  const [canvas, context, dispose] = createCanvasAndContext();

  const width = (canvas.width = w as any | 0);
  const height = (canvas.height = h as any | 0);

  const render = (time: number, initialFrame: boolean) => {
    if (!(asset.renderFrame(time) || initialFrame)) {
      return false;
    }
    context.clearRect(0, 0, width, height);
    context.drawImage(asset.canvas, 0, 0, asset.width, asset.height, 0, 0, canvas.width, canvas.height);
    return true;
  };

  return [new Asset(asset.duration, canvas.width, canvas.height, canvas, context, render, dispose)];
};

export default scale;

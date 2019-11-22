import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const toNonZeroInt = (z: number | string): number => {
  // tslint:disable-next-line:no-bitwise
  const zInt = (z as any) | 0;

  return zInt === 0 ? 1 : zInt;
};

const scale: Filter = ([asset], {w, h}) => {
  const [canvas, context, dispose] = createCanvasAndContext();

  const width = toNonZeroInt(w);
  const height = toNonZeroInt(h);

  canvas.width = width;
  canvas.height = height;

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

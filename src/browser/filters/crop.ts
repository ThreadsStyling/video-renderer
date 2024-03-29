import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const crop: Filter = ([asset], args) => {
  const [canvas, context, dispose] = createCanvasAndContext();
  const width = (args.w || args.out_w) as any | 0;
  const height = (args.h || args.out_h) as any | 0;
  const x = args.x as any | 0;
  const y = args.y as any | 0;

  canvas.width = width;
  canvas.height = height;

  const render = (time: number, initialFrame: boolean) => {
    if (!(asset.renderFrame(time) || initialFrame)) {
      return false;
    }
    context.clearRect(0, 0, width, height);
    context.drawImage(asset.canvas, x, y, width, height, 0, 0, width, height);
    return true;
  };

  return [new Asset(asset.duration, width, height, canvas, context, render, dispose)];
};

export default crop;

import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const rotate: Filter = ([asset], args) => {
  const [canvas, context, dispose] = createCanvasAndContext();
  const width = (args.width || args.w) as any | 0;
  const height = (args.height || args.h) as any | 0;
  const x = args.x as any | 0;
  const y = args.y as any | 0;
  const color = String(args.color) || '#000000';

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = color;

  const render = (time: number, initialFrame: boolean) => {
    if (!(asset.renderFrame(time) || initialFrame)) {
      return false;
    }
    context.clearRect(0, 0, width, height);
    context.fillRect(0, 0, width, height);
    context.clearRect(x, y, asset.width, asset.height);
    context.drawImage(asset.canvas, x, y);
    return true;
  };

  return [new Asset(asset.duration, width, height, canvas, context, render, dispose)];
};

export default rotate;

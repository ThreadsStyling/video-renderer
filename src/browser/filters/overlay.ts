import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const overlay: Filter = ([background, foreground], args) => {
  const x = args.x as any | 0;
  const y = args.y as any | 0;
  const {width, height} = background;
  const [canvas, context] = createCanvasAndContext();

  canvas.width = width;
  canvas.height = height;

  const render = (time: number, initialFrame: boolean) => {
    const backgroundUpdated = background.renderFrame(time);
    const foregroundUpdated = foreground.renderFrame(time);
    if (!(backgroundUpdated || foregroundUpdated || initialFrame)) {
      return false;
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(background.canvas, 0, 0);
    context.drawImage(foreground.canvas, x, y);
    return true;
  };

  return [new Asset(background.duration, width, height, canvas, context, render)];
};

export default overlay;

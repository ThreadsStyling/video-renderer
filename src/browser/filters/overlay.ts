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

  const render = (time: number) => {
    background.renderFrame(time);
    foreground.renderFrame(time);

    context.clearRect(0, 0, width, height);
    context.drawImage(background.canvas, 0, 0);
    context.drawImage(foreground.canvas, x, y);
  };

  return [new Asset(background.duration, width, height, canvas, context, render)];
};

export default overlay;

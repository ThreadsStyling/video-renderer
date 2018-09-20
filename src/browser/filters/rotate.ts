import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const rotate: Filter = ([asset], {angle}) => {
  const [canvas, context] = createCanvasAndContext();

  context.rotate(angle as any | 0);

  const render = (time: number) => {
    asset.renderFrame(time);
    context.drawImage(asset.canvas, 0, 0);
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

import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const rotate: Filter = ([asset], {angle, out_w, out_h, fillcolor = '#000000'}) => {
  const [canvas, context] = createCanvasAndContext();
  const width = out_w ? (out_w as any | 0) : asset.width;
  const height = out_h ? (out_h as any | 0) : asset.height;
  const angleInRadians = angle as any | 0;

  canvas.width = width;
  canvas.height = height;

  const render = (time: number) => {
    asset.renderFrame(time);

    context.clearRect(0, 0, width, height);
    context.save();
    context.fillStyle = String(fillcolor);
    context.fillRect(0, 0, width, height);
    context.translate(width / 2, height / 2);
    context.rotate(angleInRadians);
    context.drawImage(asset.canvas, -asset.canvas.width / 2, -asset.canvas.height / 2);
    context.restore();
  };

  return [new Asset(asset.duration, width, height, canvas, context, render)];
};

export default rotate;

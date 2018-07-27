import Filter from '../Filter';
import Asset from '../Asset';

const overlay: Filter = (inputs, args) => {
  const start = +args.start;
  const end = +args.end;
  const i = inputs[0];
  if (start === 0) {
    return [new Asset(end, i.width, i.height, i.canvas, i.context, i.renderFrame)];
  }
  return [new Asset(end - start, i.width, i.height, i.canvas, i.context, (time) => i.renderFrame(time + start))];
};

export default overlay;

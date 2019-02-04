import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';
import {Parser} from 'expr-eval';

const parser = new Parser();

const drawtext: Filter = ([background], args) => {
  const [canvas, context, disposeCanvas] = createCanvasAndContext();
  const {width, height} = background;

  canvas.width = width;
  canvas.height = height;

  const xExpression = parser.parse(String(args.x));
  const yExpression = parser.parse(String(args.y));
  const wExpression = parser.parse(String(args.w));
  const hExpression = parser.parse(String(args.h));

  // Evaluate expressions.
  const expressionArgs = {
    h: args.h,
    w: args.w,
    ih: height,
    iw: width,
  };
  const x = xExpression.evaluate(expressionArgs);
  const y = yExpression.evaluate(expressionArgs);
  const w = wExpression.evaluate(expressionArgs);
  const h = hExpression.evaluate(expressionArgs);
  const color = String(args.color) || '';

  const render = (time: number, initialFrame: boolean) => {
    if (!(background.renderFrame(time) || initialFrame)) {
      return false;
    }
    context.clearRect(0, 0, width, height);
    context.drawImage(background.canvas, 0, 0);
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
    return true;
  };

  return [
    new Asset(background.duration, width, height, canvas, context, render, () => {
      disposeCanvas();
    }),
  ];
};

export default drawtext;

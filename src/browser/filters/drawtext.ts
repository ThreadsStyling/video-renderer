import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';
import {Parser} from 'expr-eval';

const MAGIC_Y_END = 4.2;
const parser = new Parser();

function parse(path: string) {
  return (path.split('/').pop() || '').split('.').shift();
}

const drawtext: Filter = ([background], args) => {
  const [canvas, context] = createCanvasAndContext();
  const [textCanvas, textContext] = createCanvasAndContext();
  const {width, height} = background;

  canvas.width = width;
  canvas.height = height;

  // We use font file name as font face.
  const font = parse(String(args.fontfile)) || '';
  const xExpression = parser.parse(String(args.x));
  const yExpression = parser.parse(String(args.y));
  const text = String(args.text) || '';
  const fontsize = +(args.fontsize || 0);
  const fontcolor = String(args.fontcolor) || '';
  const box = String(args.box) === '1';
  const boxborderw = +(args.boxborderw || 0);
  const boxcolor = String(args.boxcolor) || '';

  // Measure text and evaluate expressions.
  textContext.font = `${fontsize}px ${font}`;
  const tw = textContext.measureText(text).width;
  const expressionArgs = {
    tw,
    text_w: tw,
  };
  const x = xExpression.evaluate(expressionArgs);
  const y = yExpression.evaluate(expressionArgs);

  // Draw text on canvas once.
  textCanvas.width = tw + (boxborderw * 2);
  textCanvas.height = fontsize - (fontsize / MAGIC_Y_END) + (boxborderw * 2);
  if (box) {
    textContext.fillStyle = boxcolor;
    textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
  }
  textContext.textBaseline = 'top';
  textContext.font = `${fontsize}px ${font}`;
  textContext.fillStyle = fontcolor;
  textContext.fillText(text, boxborderw, boxborderw - 2);

  const render = (time: number) => {
    background.renderFrame(time);
    context.clearRect(0, 0, width, height);
    context.drawImage(background.canvas, 0, 0);
    context.drawImage(textCanvas, x - boxborderw, y - boxborderw);
  };

  return [new Asset(background.duration, width, height, canvas, context, render)];
};

export default drawtext;

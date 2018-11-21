import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';
import {Parser} from 'expr-eval';
import measureText from '../util/measureText';

const parser = new Parser();

function parse(path: string) {
  return (path.split('/').pop() || '').split('.').shift();
}

const drawtext: Filter = ([background], args) => {
  const [canvas, context, disposeCanvas] = createCanvasAndContext();
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
  const fontStyle = `${fontsize}px ${font}`;

  const {tw, th, start} = measureText({text, font, fontsize});
  // Evaluate expressions.
  const expressionArgs = {
    tw,
    text_w: tw,
    th,
    text_h: th,
  };
  const x = xExpression.evaluate(expressionArgs);
  const y = yExpression.evaluate(expressionArgs);

  // Draw text on canvas once.
  const [textCanvas, textContext, disposeText] = createCanvasAndContext();

  textCanvas.width = tw + boxborderw * 2;
  textCanvas.height = th + boxborderw * 2 || 1;
  if (box) {
    textContext.fillStyle = boxcolor;
    textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
  }
  textContext.textBaseline = 'top';
  textContext.font = fontStyle;
  textContext.fillStyle = fontcolor;
  textContext.fillText(text, boxborderw, boxborderw - start);

  const render = (time: number, initialFrame: boolean) => {
    if (!(background.renderFrame(time) || initialFrame)) {
      return false;
    }
    context.clearRect(0, 0, width, height);
    context.drawImage(background.canvas, 0, 0);
    context.drawImage(textCanvas, x - boxborderw, y - boxborderw);
    return true;
  };

  return [
    new Asset(background.duration, width, height, canvas, context, render, () => {
      disposeCanvas();
      disposeText();
    }),
  ];
};

export default drawtext;

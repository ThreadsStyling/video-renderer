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
  const fontStyle = `${fontsize}px ${font}`;

  // Measure text width.
  textContext.font = `${fontsize}px ${font}`;
  const tw = textContext.measureText(text).width;

  // Measure text height.
  const [thCanvas, thContext] = createCanvasAndContext();
  thCanvas.width = 1e3;
  thCanvas.height = 1e3;
  thContext.fillRect(0, 0, thCanvas.width, thCanvas.height);
  thContext.textBaseline = 'top';
  thContext.fillStyle = 'white';
  thContext.font = fontStyle;
  thContext.fillText(text, 0, 0);
  const pixels = thContext.getImageData(0, 0, thCanvas.width, thCanvas.height).data;
  let start = -1;
  let end = -1;
  for (let row = 0; row < thCanvas.height; row++) {
    for (let column = 0; column < thCanvas.width; column++) {
      const index = (row * thCanvas.width + column) * 4;
      if (pixels[index] === 0) {
        if (column === thCanvas.width - 1 && start !== -1) {
          end = row;
          row = thCanvas.height;
          break;
        }
        continue;
      }
      else
      {
        if (start === -1)
        {
          start = row;
        }
        break;
      }
    }
  }
  const th = end - start;

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
  textCanvas.width = tw + (boxborderw * 2);
  textCanvas.height = fontsize - (fontsize / MAGIC_Y_END) + (boxborderw * 2);
  if (box) {
    textContext.fillStyle = boxcolor;
    textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
  }
  textContext.textBaseline = 'top';
  textContext.font = fontStyle;
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

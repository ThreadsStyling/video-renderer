import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';
import {Parser} from 'expr-eval';

const parser = new Parser();

function parse(path: string) {
  return (path.split('/').pop() || '').split('.').shift();
}

const drawtext: Filter = ([background], args) => {
  const [canvas, context, disposeCanvas] = createCanvasAndContext();
  const [textCanvas, textContext, disposeText] = createCanvasAndContext();
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
  const [thCanvas, thContext, disposeTh] = createCanvasAndContext();
  thCanvas.width = fontsize * 2 * text.length;
  thCanvas.height = fontsize * 2;
  thContext.fillRect(0, 0, thCanvas.width, thCanvas.height);
  thContext.textBaseline = 'top';
  thContext.fillStyle = 'white';
  thContext.font = fontStyle;
  thContext.fillText(text, 0, 0);
  const pixels = thContext.getImageData(0, 0, thCanvas.width, thCanvas.height).data;
  let start = -1;
  let end = -1;

  // iterate the rows
  for (let row = 0; row < thCanvas.height; row++) {
    // iterate the columns
    for (let column = 0; column < thCanvas.width; column++) {
      // get alpha value for this pixel
      const index = (row * thCanvas.width + column) * 4;

      // found a black pixel
      if (pixels[index] === 0) {
        // we are at the end of an all black row and start has been found
        if (column === thCanvas.width - 1 && start !== -1) {
          // set the end, but only if we haven't got one already
          if (end === -1) end = row;

          // exit inner loop
          break;
        }

        // continue searching this row
        continue;
      } else {
        // we found a non black pixel
        // and we haven't found the start yet
        if (start === -1) {
          // we found the start row
          start = row;
        }

        // if we hit non-black after starting, we must look for a new end
        end = -1;

        // don't check the rest of this row
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
      disposeTh();
    }),
  ];
};

export default drawtext;

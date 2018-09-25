import {Filter} from '.';
import Asset from '../Asset';
import createCanvasAndContext from '../util/createCanvasAndContext';

const MAGIC_Y_END = 4.2;

function parse(path: string) {
  return (path.split('/').pop() || '').split('.').shift();
}

const drawtext: Filter = ([background], args) => {
  const [canvas, context] = createCanvasAndContext();
  const {width, height} = background;

  canvas.width = width;
  canvas.height = height;
  context.textBaseline = 'top';

  // We use font file name as font face.
  const font = parse(String(args.fontfile)) || '';

  const x = +(args.x || 0);
  const y = +(args.y || 0);
  const text = String(args.text) || '';
  const fontsize = +(args.fontsize || 0);
  const fontcolor = String(args.fontcolor) || '';
  const box = String(args.box) === '1';
  const boxborderw = +(args.boxborderw || 0);
  const boxcolor = String(args.boxcolor) || '';

  const render = (time: number) => {
    // Render background.
    background.renderFrame(time);
    context.clearRect(0, 0, width, height);
    context.drawImage(background.canvas, 0, 0);

    // Render text.
    context.font = `${fontsize}px ${font}`;
    if (box) {
      const measurement = context.measureText(text);
      context.fillStyle = boxcolor;
      context.fillRect(
        x - boxborderw,
        y - boxborderw,
        measurement.width + boxborderw * 2,
        fontsize - fontsize / MAGIC_Y_END + boxborderw * 2,
      );
    }
    context.fillStyle = fontcolor;
    context.fillText(text, x, y - 2);
  };

  return [
    new Asset(
      background.duration,
      width,
      height,
      canvas,
      context,
      render,
    ),
  ];
};

export default drawtext;

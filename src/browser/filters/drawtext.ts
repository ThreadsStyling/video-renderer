import {Filter} from '.';
import Asset from '../Asset';

const MAGIC_Y_END = 4.2;

function parse(path: string) {
  return (path.split('/').pop() || '').split('.').shift();
}

const drawtext: Filter = ([background], args) => {
  const x = +(args.x || 0);
  const y = +(args.y || 0);
  const text = String(args.text) || '';

  // We use font file name as font face.
  const font = parse(String(args.fontfile)) || '';

  const fontsize = +(args.fontsize || 0);
  const fontcolor = String(args.fontcolor) || '';
  const box = String(args.box) === '1';
  const boxborderw = +(args.boxborderw || 0);
  const boxcolor = String(args.boxcolor) || '';

  return [
    new Asset(
      background.duration,
      background.width,
      background.height,
      background.canvas,
      background.context,
      (time) => {
        background.renderFrame(time);
        background.context.font = `${fontsize}px ${font}`;
        if (box) {
          background.context.fillStyle = boxcolor;
          const details = background.context.measureText(text);
          background.context.fillRect(
            x - boxborderw,
            y - boxborderw,
            details.width + boxborderw * 2,
            fontsize - fontsize / MAGIC_Y_END + boxborderw * 2,
          );
        }
        background.context.fillStyle = fontcolor;
        background.context.textBaseline = 'top';
        background.context.fillText(text, x, y - 2);
      },
    ),
  ];
};

export default drawtext;

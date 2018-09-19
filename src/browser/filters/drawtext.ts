import {Filter} from '.';
import Asset from '../Asset';

const MAGIC_Y_START = 3.2;
const MAGIC_Y_END = 3.3;

function parse (path: string) {
  return (path.split('/').pop() || '').split('.').shift();
}

const drawtext: Filter = (inputs, args) => {
  const i = inputs[0];
  const x = +(args.x || 0);
  const y = +(args.y || 0);
  const text = String(args.text) || '';
  // FONT FILE ASSUMES THAT THE FONT IS AVAILABLE IN THE BROWSER (via @font etc)
  const font = parse(String(args.fontfile)) || '';
  const fontsize = String(args.fontsize) || '';
  const fontcolor = String(args.fontcolor) || '';
  const box = +(args.box || 0);
  const boxborderw = +(args.boxborderw || 0);
  const boxcolor = String(args.boxcolor) || '';
  return [
    new Asset(
      i.duration,
      i.width,
      i.height,
      i.canvas,
      i.context,
      (time) => {
        i.renderFrame(time);
        i.context.font = `${fontsize}px ${font}`;
        if (box) {
          const numericFontSize = Number(fontsize);
          i.context.fillStyle = boxcolor;
          const details = i.context.measureText(text);
          i.context.fillRect(
            x - boxborderw,
            y - numericFontSize + (numericFontSize/MAGIC_Y_START) - boxborderw,
            details.width + (boxborderw * 2),
            numericFontSize - (numericFontSize/MAGIC_Y_END) + (boxborderw * 2)
          );
        }
        i.context.fillStyle = fontcolor;
        i.context.fillText(text, x, y);
      },
    ),
  ];
};

export default drawtext;

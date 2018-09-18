import {Filter} from '.';
import Asset from '../Asset';

const overlay: Filter = (inputs, args) => {
  const x = +(args.x || 0);
  const y = +(args.y || 0);
  const backgroundAsset = inputs[0];
  const background = backgroundAsset.context;
  const foreground = inputs[1].canvas;
  const renderBackground = backgroundAsset.renderFrame;
  const renderForeground = inputs[1].renderFrame;

  return [
    new Asset(
      backgroundAsset.duration,
      backgroundAsset.width,
      backgroundAsset.height,
      backgroundAsset.canvas,
      background,
      (time) => {
        renderBackground(time);
        renderForeground(time);
        background.drawImage(foreground, x, y);
      },
    ),
  ];
};

export default overlay;

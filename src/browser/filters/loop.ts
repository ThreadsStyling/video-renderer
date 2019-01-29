import {Filter} from '.';
import Asset from '../Asset';

const loop: Filter = ([asset]) => {
  return [new Asset(asset.duration, asset.width, asset.height, asset.canvas, asset.context, asset.renderFrame)];
};

export default loop;

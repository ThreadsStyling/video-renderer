import {Filter} from '.';
import Asset from '../Asset';

/**
 * A no-op filter for anything that doesn't affect canvas implementation
 */
const noop: Filter = ([asset]) => {
  return [new Asset(asset.duration, asset.width, asset.height, asset.canvas, asset.context, asset.renderFrame)];
};

export default noop;

import Asset from '../Asset';
import trim from './trim';
import overlay from './overlay';
import drawtext from './drawtext';
import noop from './noop';
import scale from './scale';
import drawbox from './drawbox';
import rotate from './rotate';
import crop from './crop';
import blend from './blend';
import pad from './pad';

export type Filter = (frames: Asset[], args: {[key: string]: string | number}) => Asset[];
export interface FiltersByName {
  [name: string]: Filter | undefined;
}
export const filters: FiltersByName = {
  trim,
  overlay,
  drawtext,
  drawbox,
  loop: noop,
  format: noop,
  scale,
  rotate,
  crop,
  blend,
  pad,
};

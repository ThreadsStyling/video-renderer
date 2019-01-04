import Asset from '../Asset';
import trim from './trim';
import overlay from './overlay';
import drawtext from './drawtext';
import loop from './loop';
import scale from './scale';
import rotate from './rotate';
import crop from './crop';
import pad from './pad';
import blend from './blend';

export type Filter = (frames: Asset[], args: {[key: string]: string | number}) => Asset[];
export interface FiltersByName {
  [name: string]: Filter | undefined;
}
export const filters: FiltersByName = {
  trim,
  overlay,
  drawtext,
  loop,
  scale,
  rotate,
  crop,
  pad,
  blend,
};

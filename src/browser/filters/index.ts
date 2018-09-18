import Asset from '../Asset';
import trim from './trim';
import overlay from './overlay';

export type Filter = (frames: Asset[], args: {[key: string]: string | number}) => Asset[];
export type FiltersByName = {[name: string]: Filter};

const filters: FiltersByName = {
  trim,
  overlay,
};

export default filters;

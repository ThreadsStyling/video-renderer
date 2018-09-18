import Asset from '../Asset';
import trim from './trim';
import overlay from './overlay';

export type Filter = (frames: Asset[], args: {[key: string]: string | number}) => Asset[];
export interface FiltersByName {
  [name: string]: Filter | undefined
};
export const filters: FiltersByName = {
  trim,
  overlay,
};

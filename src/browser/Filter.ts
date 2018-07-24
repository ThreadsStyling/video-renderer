import Asset from './Asset';
type Filter = (frames: Asset[], args: {[key: string]: string | number}) => Asset[];
export default Filter;

import AssetKind from './AssetKind';
import AssetFrame from './AssetFrame';

export interface AssetBase {
  duration: number;
  width: number;
  height: number;
  url: string;
  getFrame: (time: number) => AssetFrame;
}
export interface Video extends AssetBase {
  kind: AssetKind.Video;
}
export interface VideoWithAlpha extends AssetBase {
  kind: AssetKind.VideoWithAlpha;
}

type Asset = Video | VideoWithAlpha;
export default Asset;

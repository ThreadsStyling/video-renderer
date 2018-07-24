// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import './register/overlay';
import {AssetKind, loadAsset, filterComplex, render} from './';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

Promise.all([
  loadAsset(require('../node/__tests__/Video Of People Walking.mp4'), AssetKind.Video),
  loadAsset(require('../node/__tests__/loop.mp4'), AssetKind.VideoWithAlpha),
]).then((inputs) =>
  render(
    filterComplex(inputs, [
      {
        inputs: ['0', '1'],
        outputs: [],
        name: 'overlay',
        args: {
          x: 500,
          y: 100,
        },
      },
    ]),
    canvas,
  ),
);

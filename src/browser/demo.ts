// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import './register/overlay';
import './register/trim';
import {AssetKind, loadAsset, filterComplex, render} from '.';

const canvas = document.createElement('canvas');

canvas.style.width = '300px';
canvas.style.height = '300px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

Promise.all([
  loadAsset('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', AssetKind.Video),
  loadAsset(require('../../assets/generated/loop.mp4'), AssetKind.VideoWithAlpha),
]).then((inputs) => {
  const f = (x: number, y: number) =>
    filterComplex(inputs, [
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {x, y},
      },
      {
        name: 'trim',
        args: {
          start: 0,
          end: 5,
        },
      },
    ]);
  render(canvas, f(100, 100));
});

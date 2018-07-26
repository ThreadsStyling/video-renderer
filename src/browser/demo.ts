// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import './register/overlay';
import './register/trim';
import {AssetKind, loadAsset, filterComplex, render} from './';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

Promise.all([
  loadAsset(require('../node/__tests__/Video Of People Walking.mp4'), AssetKind.Video),
  loadAsset(require('../node/__tests__/loop.mp4'), AssetKind.VideoWithAlpha),
]).then((inputs) => {
  const f = (x: number, y: number) =>
    filterComplex(inputs, [
      {
        inputs: ['0', '1'],
        outputs: ['overlaid'],
        name: 'overlay',
        args: {x, y},
      },
      {
        inputs: ['overlaid'],
        outputs: [],
        name: 'trim',
        args: {
          start: 0,
          end: 5,
        },
      },
    ]);
  const player = render(canvas, f(500, 100));
  canvas.addEventListener(
    'mousemove',
    (e) => {
      e.preventDefault();
      player.setAsset(f(e.clientX - inputs[1].width / 2, e.clientY - inputs[1].height / 2));
    },
    false,
  );
  canvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      player.setAsset(f(touch.clientX - inputs[1].width / 2, touch.clientY - inputs[1].height / 2));
    },
    false,
  );
});

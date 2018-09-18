// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import '../src/browser/register/overlay';
import '../src/browser/register/trim';
import {filterComplex, render, Asset} from '../src/browser';

const canvas = document.createElement('canvas');

canvas.style.width = '300px';
canvas.style.height = '300px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

Promise.all([
  Asset.fromVideo('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'),
  Asset.fromVideoWithAlpha(require('../assets/generated/loop.mp4')),
  Asset.fromImage('https://user-images.githubusercontent.com/3481367/45488425-4ad14080-b759-11e8-9629-2fb02283f02e.png'),
]).then((inputs) => {
  const f = (x: number, y: number) =>
    filterComplex(inputs, [
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {x, y},
        outputs: ['merge1'],
      },
      {
        inputs: ['merge1', '2'],
        name: 'overlay',
        args: {x: 10, y: 10},
        outputs: ['merge2'],
      },
      {
        inputs: ['merge2'],
        name: 'trim',
        args: {
          start: 0,
          end: 5,
        },
      },
    ]);
  render(canvas, f(100, 100));
});

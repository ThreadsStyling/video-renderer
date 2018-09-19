// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import {filterComplex, render, Asset} from '../browser';

const canvas = document.createElement('canvas');

canvas.style.width = '300px';
canvas.style.height = '300px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

Promise.all([
  Asset.fromVideo('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'),
  Asset.fromVideoWithAlpha(require('../../assets/generated/loop.mp4')),
  Asset.fromImage(
    'https://user-images.githubusercontent.com/3481367/45488425-4ad14080-b759-11e8-9629-2fb02283f02e.png',
  ),
]).then((inputs) => {
  const f = (x: number, y: number) =>
    filterComplex(inputs, [
      {
        inputs: ['2'],
        name: 'scale',
        args: {w: 150, h: 150},
        outputs: ['asset2'],
      },
      {
        inputs: ['1'],
        name: 'scale',
        args: {w: 111, h: 111},
        outputs: ['asset1'],
      },
      {
        inputs: ['0', 'asset1'],
        name: 'overlay',
        args: {x, y},
        outputs: ['merge1'],
      },
      {
        inputs: ['merge1', 'asset2'],
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
      {
        name: 'drawtext',
        args: {
          text: 'SOME TEXT',
          x: 50,
          y: 50,
          fontsize: 72,
          fontcolor: 'white',
          box: 1,
          boxcolor: 'black',
          boxborderw: 10
        }
      }
    ]);
  render(canvas, f(100, 100));
});

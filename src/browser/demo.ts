// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import './register/overlay';
import './register/trim';
import {AssetKind, loadAsset, filterComplex, render} from './';

const canvas = document.createElement('canvas');

canvas.style.margin = 'auto';
// canvas.style.width = '100vmin';
canvas.style.display = 'block';
const style = document.createElement('style');
document.head.appendChild(style);
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

  const ratio = (100 * inputs[0].height) / inputs[0].width;
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
    }
    body {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: black;
    }
    canvas {
      height: 100vh;
    }
    @media (min-height: ${ratio}vw) {
      canvas {
        width: 100vw;
        height: auto;
      }
    }
  `;
  function update(e: {clientX: number; clientY: number}) {
    const x = (e.clientX - canvas.offsetLeft) * (canvas.width / canvas.offsetWidth);
    const y = (e.clientY - canvas.offsetTop) * (canvas.height / canvas.offsetHeight);
    player.setAsset(f(x - inputs[1].width / 2, y - inputs[1].height / 2));
  }
  canvas.addEventListener(
    'mousemove',
    (e) => {
      e.preventDefault();
      update(e);
    },
    false,
  );
  canvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      update(touch);
    },
    false,
  );
});

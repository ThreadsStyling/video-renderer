// based on https://jakearchibald.com/scratch/alphavid/
// and https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

import '../src/browser/register/overlay';
import '../src/browser/register/trim';
import {filterComplex, render, Asset} from '../src/browser';

const canvas = document.createElement('canvas');

canvas.style.margin = 'auto';
canvas.style.display = 'block';
const style = document.createElement('style');
document.head.appendChild(style);
document.body.appendChild(canvas);

Promise.all([
  Asset.fromVideo(require('../assets/Video Of People Walking.mp4')),
  Asset.fromVideoWithAlpha(require('../assets/generated/loop.mp4')),
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
  const player = render(canvas, f(500, 100));
  let start = performance.now();
  let frames = 0;
  player.onFrame(() => {
    frames++;
    if (frames > 100) {
      const end = performance.now();
      console.log(frames / ((end - start) / 1000));
      start = performance.now();
      frames = 0;
    }
  });

  const ratio = (100 * inputs[0].height) / inputs[0].width;
  style.textContent = `
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      background: black;
    }
    canvas {
      height: 100%;
    }
    @media (min-height: ${ratio}vw) {
      canvas {
        width: 100%;
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

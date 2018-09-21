import {filterComplex, render, Asset} from '../browser';

const canvas = document.createElement('canvas');

canvas.style.width = '640px';
canvas.style.height = '1136px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

Promise.all([
  Asset.fromImage(require('../../assets/image.jpg')),
  Asset.fromImage(require('../../assets/servers.png')),
]).then((inputs) => {
  render(canvas, filterComplex(inputs, [
    {
      inputs: ['1'],
      name: 'rotate',
      args: {angle: 1},
      outputs: ['rotated'],
    },
    {
      inputs: ['0', 'rotated'],
      name: 'overlay',
      args: {x: 0, y: 0},
    }
  ]));
});

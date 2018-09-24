import {filterComplex, render, Asset} from '../browser';

const canvas = document.createElement('canvas');

canvas.style.width = '100px';
canvas.style.height = '100px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

Promise.all([
  Asset.fromImage(require('../../assets/image.jpg')),
]).then((inputs) => {
  render(canvas, filterComplex(inputs, [
    {
      name: 'crop',
      args: {
        w: 100,
        h: 100,
        x: 10,
        y: 10,
      },
    },
  ]));
});

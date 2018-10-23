import {filterComplex, render, Asset} from '../browser';

const canvas = document.createElement('canvas');

canvas.style.width = '782px';
canvas.style.height = '1374px';

canvas.style.margin = 'auto';
canvas.style.display = 'block';
document.body.appendChild(canvas);

Promise.all([
  Asset.fromImage(
    'https://user-images.githubusercontent.com/9773803/45625491-45dbfc00-ba8d-11e8-8c9c-e961e08eaa99.png',
  ),
  Asset.fromImage(
    'https://user-images.githubusercontent.com/3481367/45488425-4ad14080-b759-11e8-9629-2fb02283f02e.png',
  ),
  Asset.fromImage('https://d1algegyh2h2u2.cloudfront.net/svg/landing/threads-logo-white.svg'),
])
  .then((inputs) => {
    const f = (x: number, y: number) =>
      filterComplex(inputs, [
        {
          inputs: ['1'],
          name: 'scale',
          args: {w: 50, h: 50},
          outputs: ['asset1'],
        },
        {
          inputs: ['0', 'asset1'],
          name: 'overlay',
          args: {x, y},
          outputs: ['merge1'],
        },
        {
          inputs: ['merge1', '2'],
          name: 'overlay',
          args: {x: -10, y: -10},
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
            x: 100,
            y: 100,
            fontsize: 72,
            fontcolor: 'white',
            box: 1,
            boxcolor: 'black',
            boxborderw: 10,
          },
        },
      ]);
    render(canvas, f(200, 200));
  })
  .catch((err) => console.error(err));

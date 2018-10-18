// Run: ts-node src/demo/text5.ts

import renderDemo from './util/renderDemo';

const w = 300;
const h = 100;

renderDemo(
  ['grid.jpg', '00F000-0.5.png', 'empty.png'],
  [
    {
      inputs: ['1'],
      name: 'scale',
      args: {
        w,
        h,
      },
      outputs: ['scaled1'],
    },
    {
      inputs: ['2'],
      name: 'scale',
      args: {
        w,
        h,
      },
      outputs: ['scaled2'],
    },
    {
      inputs: ['scaled1'],
      name: 'drawtext',
      args: {
        fontfile: '../Verdana.ttf',
        text: 'Where is foo?',
        x: `(${w / 2} - tw / 2)`,
        y: `(${h / 2} - th / 2)`,
        fontsize: 40,
        fontcolor: 'black',
      },
      outputs: ['txt1'],
    },
    {
      inputs: ['scaled2'],
      name: 'drawtext',
      args: {
        fontfile: '../Verdana.ttf',
        text: 'In the bag!',
        x: `(${w / 2} - tw / 2)`,
        y: `(${h / 2} - th / 2)`,
        fontsize: 40,
        fontcolor: 'black',
      },
      outputs: ['txt2'],
    },
    {
      inputs: ['0', 'txt1'],
      name: 'overlay',
      args: {
        x: 0,
        y: 0,
      },
      outputs: ['merge1'],
    },
    {
      inputs: ['merge1', 'txt2'],
      name: 'overlay',
      args: {
        x: 100,
        y: 250,
      },
      outputs: ['merge2'],
    },
    {
      inputs: ['merge2'],
      name: 'drawtext',
      args: {
        fontfile: '../Verdana.ttf',
        x: '(250 - tw / 2)',
        y: '(250 - th / 2)',
        text: 'aMg',
        fontsize: 50,
        fontcolor: 'black',
      },
    },
  ],
).catch(console.error); // tslint:disable-line

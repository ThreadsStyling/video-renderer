import {ComplexFilter} from '../browser';

const {join} = require('path');

const assetDir = join(__dirname, '..', '..', 'assets');

export interface Testcase {
  name: string;
  assets: string[];
  filters: ComplexFilter[];
}

const generateFontTests = (fontFile: string): Testcase[] => {
  return [
    {
      name: `drawtext ${fontFile}`,
      assets: [join(assetDir, 'servers.png')],
      filters: [
        {
          name: 'drawtext',
          args: {
            fontfile: `./assets/${fontFile}`,
            text: "it's not, me",
            x: 0,
            y: 10,
            fontsize: '70',
            fontcolor: 'black',
          },
        },
      ],
    },
    {
      name: `drawtext-with-background ${fontFile}`,
      assets: [join(assetDir, 'servers.png')],
      filters: [
        {
          name: 'drawtext',
          args: {
            fontfile: `./assets/${fontFile}`,
            text: "it's not, me",
            x: 15,
            y: 15,
            fontsize: '70',
            fontcolor: 'black',
            box: 1,
            boxcolor: 'pink',
            boxborderw: 10,
          },
        },
      ],
    },
  ];
};

export const testcases: Testcase[] = [
  {
    name: `drawtext-special-chars`,
    assets: [join(assetDir, 'servers.png')],
    filters: [
      {
        name: 'drawtext',
        args: {
          fontfile: `./assets/Verdana.ttf`,
          text: "Jason's \"friend\": it's, not you/me; it's you",
          x: 0,
          y: 10,
          fontsize: '18',
          fontcolor: 'black',
        },
      },
    ],
  },
  {
    name: 'drawbox-simple',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['0'],
        name: 'drawbox',
        args: {
          x: 10,
          y: 10,
          w: 500,
          h: 300,
          color: 'pink',
          t: 'fill',
        },
      },
    ],
  },
  {
    name: 'drawbox-rotated',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'empty.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'format',
        args: {
          pix_fmts: 'rgb24',
        },
        outputs: ['formatted'],
      },
      {
        inputs: ['formatted'],
        name: 'scale',
        args: {
          w: 500,
          h: 300,
        },
        outputs: ['scaled'],
      },
      {
        inputs: ['scaled'],
        name: 'drawbox',
        args: {
          x: 0,
          y: 0,
          w: 500,
          h: 300,
          color: '#ffffff',
          t: 'fill',
        },
        outputs: ['box'],
      },
      {
        inputs: ['box'],
        name: 'rotate',
        args: {
          angle: 1,
          fillcolor: '#00000000',
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {
          x: 40,
          y: 40,
        },
      },
    ],
  },
  {
    name: 'overlay-simple',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {
          x: 0,
          y: 0,
        },
      },
    ],
  },
  {
    name: 'overlay-with-offset',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {
          x: 50,
          y: 50,
        },
      },
    ],
  },
  {
    name: 'overlay-out-of-bounds',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {
          x: -30,
          y: -30,
        },
      },
    ],
  },
  {
    name: 'overlay-multiple',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
      join(assetDir, 'servers.png'),
      join(assetDir, 'servers.png'),
      join(assetDir, 'servers.png'),
    ],
    filters: [
      {
        inputs: ['0', '1'],
        name: 'overlay',
        args: {
          x: 50,
          y: 50,
        },
        outputs: ['out1'],
      },
      {
        inputs: ['out1', '2'],
        name: 'overlay',
        args: {
          x: 150,
          y: 150,
        },
        outputs: ['out2'],
      },
      {
        inputs: ['out2', '3'],
        name: 'overlay',
        args: {
          x: 250,
          y: 250,
        },
        outputs: ['out3'],
      },
      {
        inputs: ['out3', '4'],
        name: 'overlay',
        args: {
          x: 350,
          y: 350,
        },
      },
    ],
  },
  {
    name: 'scale-simple',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'scale',
        args: {
          w: 300,
          h: 300,
        },
        outputs: ['scaled'],
      },
      {
        inputs: ['0', 'scaled'],
        name: 'overlay',
        args: {
          x: 100,
          y: 100,
        },
      },
    ],
  },
  {
    name: 'scale-twice',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'scale',
        args: {
          w: 40,
          h: 40,
        },
        outputs: ['scaled1'],
      },
      {
        inputs: ['scaled1'],
        name: 'scale',
        args: {
          w: 400,
          h: 400,
        },
        outputs: ['scaled2'],
      },
      {
        inputs: ['0', 'scaled2'],
        name: 'overlay',
        args: {
          x: 10,
          y: 10,
        },
      },
    ],
  },
  {
    name: 'rotate',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'rotate',
        args: {
          angle: 1,
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'rotate-with-positive-padding',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'rotate',
        args: {
          angle: 1,
          out_w: 600,
          out_h: 600,
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'rotate-with-negative-padding',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'rotate',
        args: {
          angle: 1,
          out_w: 100,
          out_h: 100,
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'rotate-transparent-bg',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'rotate',
        args: {
          angle: 1,
          out_w: 600,
          out_h: 600,
          fillcolor: '#0077ff7f',
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'loop-noop',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'loop',
        args: {
          loop: 3,
        },
        outputs: ['looped'],
      },
      {
        inputs: ['0', 'looped'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'pad-transparent-bg',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'pad',
        args: {
          w: 600,
          h: 400,
          x: 20,
          y: 20,
          color: '#00000000',
        },
        outputs: ['padded'],
      },
      {
        inputs: ['0', 'padded'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'pad-default-bg',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'pad',
        args: {
          w: 600,
          h: 400,
          x: 20,
          y: 20,
        },
        outputs: ['padded'],
      },
      {
        inputs: ['0', 'padded'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'pad-red-bg',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'servers.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'pad',
        args: {
          w: 600,
          h: 400,
          x: 20,
          y: 20,
          color: '#ff0000',
        },
        outputs: ['padded'],
      },
      {
        inputs: ['0', 'padded'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  {
    name: 'pad-transparent-png',
    assets: [join(assetDir, 'image.jpg'), join(assetDir, 'threads-logo-gold.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'pad',
        args: {
          w: 600,
          h: 400,
          x: 20,
          y: 20,
          color: '#0000ff',
        },
        outputs: ['padded'],
      },
      {
        inputs: ['0', 'padded'],
        name: 'overlay',
        args: {x: 0, y: 0},
      },
    ],
  },
  ...generateFontTests('Verdana.ttf'),
  ...generateFontTests('Notable-Regular.ttf'),
  // failing because of font weight and letter spacing issues
  // ...generateFontTests('Berthold Akzidenz Grotesk Bold Condensed.otf'),
  // ...generateFontTests('DomaineDisplay-Regular.otf'),
  {
    name: 'drawtext-rotated',
    assets: [join(assetDir, 'servers.png'), join(assetDir, 'empty.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'scale',
        args: {
          w: 300,
          h: 300,
        },
        outputs: ['scaled'],
      },
      {
        inputs: ['scaled'],
        name: 'drawtext',
        args: {
          fontfile: './assets/Verdana.ttf',
          text: 'SOME TEXT',
          x: 15,
          y: 15,
          fontsize: 70,
          fontcolor: 'black',
          box: 1,
          boxcolor: 'pink',
          boxborderw: 10,
        },
        outputs: ['txt'],
      },
      {
        inputs: ['txt'],
        name: 'drawbox',
        args: {
          x: 100,
          y: 10,
          w: 20,
          h: 20,
          color: 'green',
          t: 'fill',
        },
        outputs: ['txt2'],
      },
      {
        inputs: ['txt2'],
        name: 'rotate',
        args: {
          angle: 1,
          fillcolor: '#00000000',
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {
          x: 10,
          y: 10,
        },
      },
    ],
  },
  {
    name: 'drawtext-expr-tw',
    assets: [join(assetDir, 'servers.png')],
    filters: [
      {
        name: 'drawtext',
        args: {
          fontfile: './assets/Verdana.ttf',
          text: 'SOME TEXT',
          x: '(0 - tw / 2)',
          y: '15',
          fontsize: 70,
          fontcolor: 'black',
          box: 1,
          boxcolor: 'pink',
          boxborderw: 10,
        },
      },
    ],
  },
  {
    name: 'drawtext-expr-th',
    assets: [join(assetDir, 'servers.png')],
    filters: [
      {
        name: 'drawtext',
        args: {
          fontfile: './assets/Verdana.ttf',
          text: 'LOL - the bear is not a fox',
          x: '15',
          y: '(50 - th / 2)',
          fontsize: 70,
          fontcolor: 'black',
          box: 1,
          boxcolor: 'pink',
          boxborderw: 10,
        },
      },
    ],
  },
  {
    name: 'drawtext-center-at-origin',
    assets: [join(assetDir, 'servers.png')],
    filters: [
      {
        name: 'drawtext',
        args: {
          fontfile: './assets/Verdana.ttf',
          text: 'O',
          x: '(0 - tw / 2)',
          y: '(0 - th / 2)',
          fontsize: 100,
          fontcolor: 'red',
        },
      },
      {
        name: 'drawtext',
        args: {
          fontfile: './assets/Verdana.ttf',
          text: 'A',
          x: '(33 - tw / 2)',
          y: '(33 - th / 2)',
          fontsize: 70,
          fontcolor: 'green',
        },
      },
    ],
  },
  {
    name: 'drawtext-with-rotation',
    assets: [join(assetDir, 'servers.png'), join(assetDir, 'empty.png')],
    filters: [
      {
        inputs: ['1'],
        name: 'scale',
        args: {
          w: 70,
          h: 70,
        },
        outputs: ['scaled'],
      },
      {
        inputs: ['scaled'],
        name: 'drawtext',
        args: {
          fontfile: './assets/Verdana.ttf',
          text: 'M',
          x: '(35 - tw / 2)',
          y: '(35 - th / 2)',
          fontsize: 70,
          fontcolor: 'green',
        },
        outputs: ['txt'],
      },
      {
        inputs: ['txt'],
        name: 'rotate',
        args: {
          angle: Math.PI / 2,
          fillcolor: '#00000000',
        },
        outputs: ['rotated'],
      },
      {
        inputs: ['0', 'rotated'],
        name: 'overlay',
        args: {
          x: 0,
          y: 0,
        },
      },
    ],
  },
];

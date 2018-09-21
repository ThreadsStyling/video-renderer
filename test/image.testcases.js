const {join} = require('path');

const assetDir = join(__dirname, '..', 'assets');

module.exports = [
  {
    name: 'overlay-simple',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
    filters: [{
      inputs: ['0', '1'],
      name: 'overlay',
      args: {
        x: 0,
        y: 0,
      },
    }],
  },
  {
    name: 'overlay-with-offset',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
    filters: [{
      inputs: ['0', '1'],
      name: 'overlay',
      args: {
        x: 50,
        y: 50,
      },
    }],
  },
  {
    name: 'overlay-out-of-bounds',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
    filters: [{
      inputs: ['0', '1'],
      name: 'overlay',
      args: {
        x: -30,
        y: -30,
      },
    }],
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
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
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
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
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
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
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
      }
    ],
  },
  {
    name: 'rotate-with-positive-padding',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
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
      }
    ],
  },
  {
    name: 'rotate-with-negative-padding',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
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
      }
    ],
  },
  {
    name: 'rotate-transparent-bg',
    assets: [
      join(assetDir, 'image.jpg'),
      join(assetDir, 'servers.png'),
    ],
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
      }
    ],
  },
  /* ffmpeg crashes on this, possibly needs some flag
  {
    name: 'drawtext',
    assets: [
      join(assetDir, 'image.jpg'),
    ],
    filters: [
      {
        name: 'drawtext',
        args: {
          text: 'SOME TEXT',
          x: 10,
          y: 10,
          fontsize: 72,
          fontcolor: 'white',
          box: 1,
          boxcolor: 'black',
          boxborderw: 10
        }
      }
    ],
  },
  */
];
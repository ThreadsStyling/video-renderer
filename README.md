# Isomorphic Video Render

Render a preview of a looping video in a browser, and render that same video on a server using ffmpeg.

## Installation

```
yarn add @threads/isomorphic-video-render
```

## Shared API

### ComplexFilter

```js
import {ComplexFilter} from '@threads/isomorphic-video-render/browser';
// or
import {ComplexFilter} from '@threads/isomorphic-video-render/node';
```

An object, representing a filter that can be applied to one or more inputs. For example, the extract alpha filter looks like:

```typescript
const filter: ComplexFilter[] = [
  // ensure video is even number of pixels heigh/wide
  // because mp4 requires this
  {
    inputs: ['0'],
    name: 'scale',
    args: {
      w: 'trunc(iw/2)*2',
      h: 'trunc(ih/2)*2',
    },
    outputs: ['extract_alpha_scaled'],
  },
  // create 2 copies of video
  {
    inputs: ['extract_alpha_scaled'],
    name: 'split',
    args: {},
    outputs: ['extract_alpha_scaled_1', 'extract_alpha_scaled_2'],
  },
  // [mask] set format to rgba
  {
    inputs: ['extract_alpha_scaled_2'],
    name: 'format',
    args: {
      pix_fmts: 'rgba',
    },
    outputs: ['extract_alpha_rgba'],
  },
  // [mask] generate alpha mask
  {
    inputs: ['extract_alpha_rgba'],
    name: 'alphaextract',
    args: {},
    outputs: ['extract_alpha_extracted'],
  },
  // [original] pad to allow space at the bottom for the alpha mask
  {
    inputs: ['extract_alpha_scaled_1'],
    name: 'pad',
    args: {h: 'ih*2'},
    outputs: ['extract_alpha_padded'],
  },
  // overlay the alpha mask on the space created at the bottom of the original video
  {
    inputs: ['extract_alpha_padded', 'extract_alpha_extracted'],
    name: 'overlay',
    args: {x: '0', y: 'overlay_h'},
  },
];
```

## Browser API

### AssetKind

```js
import {AssetKind} from '@threads/isomorphic-video-render/browser';
```

An enum for the kind of asset you are loading (e.g. video, photo etc.)

### Asset

```js
import {Asset} from '@threads/isomorphic-video-render/browser';
```

An object representing a media asset, such as a video, or photo

### filterComplex

```js
import '@threads/isomorphic-video-render/browser/register/trim';
import {loadAsset} from '@threads/isomorphic-video-render/browser';

loadAsset(videoURL, AssetKind.Video).then((inputVideo) => {
  const trimmedVideo = filterComplex([inputVideo], [
    {
      name: 'trim',
      args: {
        start: 0,
        end: 5,
      },
    },
  ]);
  // ...
});
```

Apply a graph of filters to an asset. Returns a transformed asset. N.B. you must "register" any of the filters you want to use, by importing the relevant module.

### loadAsset

```js
import {loadAsset} from '@threads/isomorphic-video-render/browser';

loadAsset(videoURL, AssetKind.Video).then(videoAsset => {
  // ...
});
```

Load an asset at a given URL, returning a Promise for that asset.

### Player

```js
import {Player} from '@threads/isomorphic-video-render/browser';
```

The player object returned by calling `render`:

```typescript
interface Player {
  setAsset(asset: Asset): void;
  getAsset(): Asset | undefined;
  isPaused(): boolean;
  pause(): void;
  play(): void;
  seek(time: number): void;
  dispose(): void;
  onFrame(handler: (state: RenderState) => void): () => void;
}
```

### render

```js
import {render} from '@threads/isomorphic-video-render/browser';

const player = render(canvas, asset);
```

Render an asset onto a canvas.

## Node API

### extractAlpha

```js
import {spawn} from 'child_process';
import {extractAlpha, filterComplex} from '@threads/isomorphic-video-render/node';

const ffmpegProc = spawn('ffmpeg', [
    '-i',
    __dirname + '/loop.gif',
    '-movflags',
    'faststart',
    // pix_fmt is needed for converting gifs
    '-pix_fmt',
    'yuv420p',
    '-filter_complex',
    filterComplex(extractAlpha()),
    __dirname + '/loop.mp4',
]);
```

Generates the complex filter graph required to convert a gif/video with transparent background into a video that uses a separate greyscale image to encode the alpha channel as a mask. This can be used on the client side with an asset kind of `AssetKind.VideoWithAlpha`. GIFs are currently not supported on the client side without this transformation.

### filterComplex

```js
import {spawn} from 'child_process';
import {filterComplex} from '@threads/isomorphic-video-render/node';

const ffmpegProc = spawn('ffmpeg', [
    '-i',
    __dirname + '/input.mp4',
    '-movflags',
    'faststart',
    '-filter_complex',
    filterComplex([
      {
        name: 'trim',
        args: {
          start: 0,
          end: 5,
        },
      },
    ]),
    __dirname + '/output.mp4',
]);
```

Takes the `ComplexFilter` objects and generates the `filter_complex` string that is expected by the ffmpeg command line tool.

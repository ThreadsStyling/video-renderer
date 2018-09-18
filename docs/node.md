# Node API


## Reference

### `extractAlpha()` Method

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


### `filterComplex()` Method

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

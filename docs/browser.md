# Browser API

POC browser implementation was based on:

- https://jakearchibald.com/scratch/alphavid/
- https://stackoverflow.com/questions/4073303/can-i-have-a-video-with-transparent-background-using-html5-video-tag

## Usage

```js
import {Asset, render, filterComplex} from '@threads/isomorphic-video-render/browser';

const asset1 = await Asset.fromImage(url1);
const asset2 = await Asset.fromImage(url2);

render(canvas, filterComplex([asset1, asset2], [
  {
    inputs: ['0', '1'],
    name: 'overlay',
    args: {x: 20, y: 20},
  }
]));
```

## Reference

### `Asset` Class

```js
import {Asset} from '@threads/isomorphic-video-render/browser';
```

An object representing a media asset, such as a video, or a photo.

Use `Asset.from*` methods to load asset.

- `Asset.fromImage(): Promise<Asset>`
- `Asset.fromVideo(): Promise<Asset>`
- `Asset.fromVideoWithAlpha(): Promise<Asset>`

Load an asset at a given URL, returning a `Promise` for that asset.

```js
await Asset.loadVideo(videoURL);
```

Use Asset.withPlaceholder to render a ready asset (like a loader) while the main asset is loading.

- `Asset.withPlaceholder(asset: Promise<Asset>, placeholder: Asset): Asset`

The placeholder asset can be anything, a video, image or just an empty asset that renders stuff to it's context.

### `filterComplex()` Method

```js
import '@threads/isomorphic-video-render/browser/register/trim';
import {loadAsset} from '@threads/isomorphic-video-render/browser';

const inputVideo = await Asset.fromVideo(videoURL);
const trimmedVideo = filterComplex([inputVideo], [
  {
    name: 'trim',
    args: {
      start: 0,
      end: 5,
    },
  },
]);
```

Apply a graph of filters to an asset. Returns a transformed asset.

### `Player` Class

```js
import {Player} from '@threads/isomorphic-video-render/browser';
```

A `Player` instance is returned `render()` method (see below).

```ts
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

### `render()` Method

```js
import {render} from '@threads/isomorphic-video-render/browser';

const player = render(canvas[, asset, fps]);
```

Render an asset onto a canvas.

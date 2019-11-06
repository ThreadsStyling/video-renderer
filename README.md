# Video Renderer

🎬 unified interface for expressing rendering streams for `ffmpeg` and `<canvas>`. You can use the `<canvas>` render to build a fast editing experience in the browser (at Threads we're even using this on mobile devices), then use FFMPEG to render an optimised, high resolution mp4/jpeg/etc. output.

Due to ffmpeg's wide format support and extensive list of filters, this works well for both videos and static images.

> N.B. This is just the basic building block for video/image editing experiences. We don't provide any reference editor.

## Installation

```
yarn add video-renderer
```

## Usage

- [**Shared API**](./docs/shared.md)
- [**Browser API**](./docs/browser.md)
- [**Node API**](./docs/node.md)
- [**`ffmpeg` Examples**](./docs/ffmpeg-examples.md)

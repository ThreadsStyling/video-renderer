# Isomorphic Video Render

Render a preview of a looping video in a browser, and render that same video on a server using `ffmpeg`.


## Installation

```
yarn add @threads/isomorphic-video-render
```


## Usage

- [__Shared API__](./docs/shared.md)
- [__Browser API__](./docs/browser.md)
- [__Node API__](./docs/node.md)


`ffmpeg` examples

```shell
./src/node/__tests__/bin/ffmpeg \
  -i assets/image.jpg \
  -i assets/image.jpg \
  -movflags \
  faststart \
  -pix_fmt \
  -filter_complex \
  "[0][1]overlay=x=10:y=10[merged]" \
  -f jpg \
  out.jpg

./src/node/__tests__/bin/ffmpeg \
  -i assets/image.jpg  \
  -i assets/image.jpg  \
  -filter_complex "[0][1] overlay=25:25" \
  -pix_fmt yuv420p -c:a copy \
  output.jpg

./src/node/__tests__/bin/ffmpeg \
  -i assets/image.jpg  \
  -i assets/threads-logo-gold.png  \
  -filter_complex "[0][1] overlay=25:25" \
  -pix_fmt yuv420p -c:a copy \
  output.jpg

./src/node/__tests__/bin/ffmpeg \
  -i assets/image.jpg  \
  -i assets/threads-logo-gold.png  \
  -filter_complex "[1] rotate=.5[rotated];[0][rotated] overlay=25:25" \
  -pix_fmt yuv420p -c:a copy \
  output.jpg

./src/node/__tests__/bin/ffmpeg \
  -i assets/image.jpg  \
  -i assets/image.jpg  \
  -filter_complex "[1] rotate=.5[rotated];[0][rotated] overlay=25:25" \
  -pix_fmt yuv420p -c:a copy \
  output.jpg

./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/image.jpg  \
  -filter_complex "[1] rotate='.5:ow=hypot(iw,ih):oh=ow:c=none' [ov]; [0][ov] overlay=25:25" \
  -c:a copy \
  output.jpg

./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/image.jpg  \
  -filter_complex "[1] pad=(sqrt((iw * iw) + (ih * ih))):(sqrt((iw * iw) + (ih * ih))):(ow-iw)/2:(oh-ih)/2:black@0, rotate='.5:ow=hypot(iw,ih):oh=ow:c=none' [ov]; [0][ov] overlay=25:25" \
  -c:a copy \
  output.jpg
```
# `ffmpeg` Examples

## Merging streams (`overlay` filter)

Place one image on top of other at position `30, 30`.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[0][1]overlay=x=30:y=30" \
  output.jpg
```

## Padding (`pad` filter)

Add padding.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[1] pad=width=600:height=400:x=20:y=20:color=#ff0000[padded]; [0][padded] overlay=0:0" \
  output.jpg
```

Add padding with transparent background.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[1] pad=width=600:height=400:x=20:y=20:color=#00000000[padded]; [0][padded] overlay=0:0" \
  output.jpg
```

## Rotation (`rotate` filter)

Rotate by `1rad` (around _center-center_ origin).

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[1] rotate=angle=1[rotated];[0][rotated] overlay=0:0" \
  output.jpg
```

Rotate and change width.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[1] rotate=angle=1:out_w=600:out_h=600[rotated];[0][rotated] overlay=0:0" \
  output.jpg
```

Rotate with transparent background.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[1] rotate=angle=1:out_w=600:out_h=600:fillcolor=#0077ff7f[rotated];[0][rotated] overlay=0:0" \
  output.jpg
```

## Cropping (`crop` filter)

Crop stream.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -filter_complex "[0] crop=w=100:h=100:x=10:y=10" \
  output.jpg
```

## Blending (`blend` filter)

Crop stream.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/servers.png  \
  -filter_complex "[0]crop=w=200:h=200:x=100:y=100[c1]; [1]crop=w=200:h=200:x=0:y=0[c2]; [c2][c1]blend=c0_mode=multiply[m]; [0][m]overlay=x=100:y=100" \
  output.jpg
```

## Text (`drawtext` filter)

Write text.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -filter_complex " \
    [0] drawtext = \
      :text=SOME TEXT \
      :x=(0-tw/2) \
      :y=0 \
      :fontfile=./assets/Verdana.ttf \
      :fontsize=30 \
      :fontcolor=white" \
  output.jpg
```

Write text on a separate layer and rotate it.

```shell
./src/node/__tests__/bin/ffmpeg -y \
  -i assets/image.jpg  \
  -i assets/empty.png \
  -i assets/empty.png \
  -filter_complex " \
    [1] scale = :w=300 :h=300 [ns]; \
    [2] scale = :w=300 :h=300 [ns2]; \
    [ns] drawtext= \
      text=SOME TEXT: \
      x=(150-tw/2): \
      y=(150-th/2): \
      fontfile=./assets/Notable-Regular.ttf: \
      fontsize=30: \
      fontcolor=red \
    [txt]; \
    [ns2] drawtext= \
      text=SOME TEXT: \
      x=(150-tw/2): \
      y=(150-th/2): \
      fontfile=./assets/Notable-Regular.ttf: \
      fontsize=30: \
      fontcolor=red \
    [txt2]; \
    [txt] rotate= \
      :angle=0.1 :fillcolor=#00000000 \
    [rotated]; \
    [0][rotated] overlay = :x=50 :y=50 [m1]; \
    [m1][txt2] overlay = :x=200 :y=200 \
  " \
  -qscale:v 2 \
  output.jpg
```

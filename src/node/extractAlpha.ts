import ComplexFilter from '../shared/ComplexFilter';

export default function extractAlpha(input: string = '0', output?: string): ComplexFilter[] {
  return [
    // ensure video is even number of pixels hide/wide
    // because mp4 requires this
    {
      inputs: [input],
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
      outputs: output ? [output] : [],
    },
  ];
}

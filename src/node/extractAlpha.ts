import ComplexFilter from '../shared/ComplexFilter';

export default function extractAlpha(input: string, output?: string): ComplexFilter[] {
  return [
    {
      // scale=trunc(iw/2)*2:trunc(ih/2)*2
      inputs: [input],
      name: 'scale',
      args: {
        w: 'trunc(iw/2)*2',
        h: 'trunc(ih/2)*2',
      },
      outputs: ['extract_alpha_scaled'],
    },
    {
      inputs: ['extract_alpha_scaled'],
      name: 'split',
      args: {},
      outputs: ['extract_alpha_scaled_1', 'extract_alpha_scaled_2'],
    },
    {
      inputs: ['extract_alpha_scaled_2'],
      name: 'format',
      args: {
        pix_fmts: 'rgba',
      },
      outputs: ['extract_alpha_rgba'],
    },
    {
      inputs: ['extract_alpha_rgba'],
      name: 'alphaextract',
      args: {},
      outputs: ['extract_alpha_extracted'],
    },
    {
      inputs: ['extract_alpha_scaled_1'],
      name: 'pad',
      args: {h: 'ih*2'},
      outputs: ['extract_alpha_padded'],
    },
    {
      inputs: ['extract_alpha_padded', 'extract_alpha_extracted'],
      name: 'overlay',
      args: {x: '0', y: 'overlay_h'},
      outputs: output ? [output] : [],
    },
    // {
    //   inputs: ['extract_alpha_rgba'],
    //   name: 'split',
    //   args: {},
    //   outputs: ['extract_alpha_t1', 'extract_alpha_t2'],
    // },
    // {
    //   inputs: ['extract_alpha_t1'],
    //   name: 'lutrgb',
    //   args: {
    //     r: 'maxval',
    //     g: 'maxval',
    //     b: 'maxval',
    //   },
    //   outputs: ['extract_alpha_max'],
    // },
    // {
    //   inputs: ['extract_alpha_t2'],
    //   name: 'lutrgb',
    //   args: {
    //     r: 'minval',
    //     g: 'minval',
    //     b: 'minval',
    //   },
    //   outputs: ['extract_alpha_min'],
    // },
    // {
    //   inputs: ['extract_alpha_max', 'extract_alpha_min'],
    //   name: 'overlay',
    //   args: {},
    //   outputs: output ? [output] : [],
    // },
  ];
}

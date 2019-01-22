import filterComplex from '../filterComplex';
import ComplexFilter, {FilterInputKind} from '../../shared/ComplexFilter';

const fc: ComplexFilter[] = [
  {
    inputs: [{name: '0', kind: FilterInputKind.Both}, {name: '1', kind: FilterInputKind.Both}],
    outputs: ['overlaid'],
    name: 'overlay',
    args: {
      x: 500,
      y: 100,
    },
  },
  {
    inputs: [{name: 'overlaid', kind: FilterInputKind.Both}],
    outputs: ['trimmed'],
    name: 'trim',
    args: {
      start: 0,
      end: 5,
    },
  },
  {
    inputs: [{name: 'trimmed', kind: FilterInputKind.Both}],
    name: 'drawtext',
    args: {
      fontfile: `./assets/Verdana.ttf`,
      text: "Jason's \"friend\": it's, not you/me; it's you",
      x: 0,
      y: 10,
      fontsize: '70',
      fontcolor: 'black',
    },
  },
];

test('filterComplex', () => {
  expect(filterComplex(fc)).toMatchInlineSnapshot(
    `"[0][1]overlay=x=500:y=100[overlaid],[overlaid]trim=start=0:end=5[trimmed],[trimmed]drawtext=fontfile=./assets/Verdana.ttf:text=Jason\\\\\\\\\\\\'s \\"friend\\"\\\\\\\\: it\\\\\\\\\\\\'s\\\\, not you/me\\\\; it\\\\\\\\\\\\'s you:x=0:y=10:fontsize=70:fontcolor=black"`,
  );
});

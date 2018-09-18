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
    outputs: [],
    name: 'trim',
    args: {
      start: 0,
      end: 5,
    },
  },
];

test('filterComplex', () => {
  expect(filterComplex(fc)).toBe('[0][1]overlay=x=500:y=100[overlaid],[overlaid]trim=start=0:end=5');
});

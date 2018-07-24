import Asset from './Asset';
import ComplexFilter from '../shared/ComplexFilter';
import {getFilter} from './Filters';

export default function filterComplex(inputs: ReadonlyArray<Asset>, filters: ComplexFilter[]) {
  const sources = new Map<string, Asset>();
  inputs.map((asset, index) => {
    sources.set(`${index}`, asset);
  });
  const outputs = filters.reduce<Array<Asset>>((_, filter) => {
    const inputs = filter.inputs.map((input) => {
      const i = typeof input === 'string' ? input : input.name;
      const asset = sources.get(i);
      if (!asset) {
        throw new Error(`${filter.name}: [${i}] is not provided or has already been used.`);
      }
      return asset;
    });
    const f = getFilter(filter.name);
    const outputAssets = f(inputs, filter.args);

    filter.outputs.forEach((name, i) => {
      if (outputAssets.length <= i) {
        throw new Error(`${filter.name} only has ${outputAssets.length} outputs.`);
      }
      sources.set(name, outputAssets[i]);
    });

    return outputAssets;
  }, []);
  if (outputs.length !== 1) {
    throw new Error('Complex filter should have exactly one final output');
  }
  return outputs[0];
}

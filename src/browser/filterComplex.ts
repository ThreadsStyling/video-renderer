import Asset from './Asset';
import ComplexFilter from '../shared/ComplexFilter';
import {filters} from './filters';
const faf = require('fast-af/deepEqual');

export type FilterCache = Map<
  string,
  Array<{
    inputs: Asset[];
    filter: ComplexFilter;
    outputs: Asset[];
  }>
>;
const EMPTY_CACHE: FilterCache = new Map();
export function filterComplexCached(
  inputs: ReadonlyArray<Asset>,
  complexFilters: ComplexFilter[],
  cache: FilterCache = EMPTY_CACHE,
) {
  const sources = new Map<string, Asset>();
  inputs.map((asset, index) => {
    sources.set(`${index}`, asset);
  });

  let defaultInput: Asset | null = inputs[0];
  const newCache: FilterCache = new Map();
  const getOutputAssets = (inputs: Asset[], filter: ComplexFilter) => {
    const caches = cache.get(filter.name);
    const newCaches = newCache.get(filter.name) || [];
    newCache.set(filter.name, newCaches);
    if (caches) {
      for (let i = 0; i < caches.length; i++) {
        if (
          caches[i].inputs.length === inputs.length &&
          caches[i].inputs.every((input, i) => input === inputs[i]) &&
          faf.deepEqual(caches[i].filter, filter)
        ) {
          newCaches.push(caches[i]);
          return caches[i].outputs;
        }
      }
    }
    const f = filters[filter.name];

    if (!f) {
      throw new Error('Could not find filter: ' + filter.name);
    }

    if (inputs.length === 0) {
      if (!defaultInput) {
        throw new Error(`${filter.name} does not specify an input, but there is no default input to use.`);
      }
      inputs = [defaultInput];
    }

    const outputs = f(inputs, filter.args || {});
    newCaches.push({inputs, filter, outputs});
    return outputs;
  };
  const outputs = complexFilters.reduce<Array<Asset>>((_, filter) => {
    let inputs = (filter.inputs || []).map((input) => {
      const i = typeof input === 'string' ? input : input.name;
      const asset = sources.get(i);
      sources.delete(i);
      if (!asset) {
        throw new Error(`${filter.name}: [${i}] is not provided or has already been used.`);
      }

      return asset;
    });

    const outputAssets = getOutputAssets(inputs, filter);

    (filter.outputs || []).forEach((name, i) => {
      if (outputAssets.length <= i) {
        throw new Error(`${filter.name} only has ${outputAssets.length} outputs.`);
      }
      sources.set(name, outputAssets[i]);
    });
    if (!filter.outputs || filter.outputs.length === 0) {
      defaultInput = outputAssets[0];
    } else {
      defaultInput = null;
    }

    return outputAssets;
  }, []);
  if (outputs.length !== 1) {
    throw new Error('Complex filter should have exactly one final output');
  }

  return {output: outputs[0], cache: newCache};
}
export default function filterComplex(inputs: ReadonlyArray<Asset>, complexFilters: ComplexFilter[]) {
  return filterComplexCached(inputs, complexFilters).output;
}

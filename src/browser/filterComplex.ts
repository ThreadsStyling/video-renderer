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
  inputsAssets: ReadonlyArray<Asset>,
  complexFilters: ComplexFilter[],
  cache: FilterCache = EMPTY_CACHE,
) {
  const sources = new Map<string, Asset>();
  inputsAssets.map((asset, index) => {
    sources.set(`${index}`, asset);
  });

  let defaultInput: Asset | null = inputsAssets[0];
  const newCache: FilterCache = new Map();

  const getOutputAssets = (inputs: Asset[], filter: ComplexFilter) => {
    let inputsArr = inputs;
    const caches = cache.get(filter.name);
    const newCaches = newCache.get(filter.name) || [];
    newCache.set(filter.name, newCaches);
    if (caches) {
      for (const cacheItem of caches) {
        if (
          cacheItem.inputs.length === inputsArr.length &&
          cacheItem.inputs.every((input, j) => input === inputsArr[j]) &&
          faf.deepEqual(cacheItem.filter, filter)
        ) {
          newCaches.push(cacheItem);
          return cacheItem.outputs;
        }
      }
    }
    const f = filters[filter.name];

    if (!f) {
      throw new Error('Could not find filter: ' + filter.name);
    }

    if (inputsArr.length === 0) {
      if (!defaultInput) {
        throw new Error(`${filter.name} does not specify an input, but there is no default input to use.`);
      }
      inputsArr = [defaultInput];
    }

    const outputsArr = f(inputsArr, filter.args || {});
    newCaches.push({inputs: inputsArr, filter, outputs: outputsArr});
    return outputsArr;
  };

  const outputs = complexFilters.reduce<Array<Asset>>((_, filter) => {
    const inputs = (filter.inputs || []).map((input) => {
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

  Array.from(cache.keys())
    .filter((k) => !newCache.has(k))
    .forEach((keyToDispose) => {
      const asset = cache.get(keyToDispose);

      if (asset) {
        asset.forEach((a) => {
          a.inputs.forEach((i) => i.dispose());
          a.outputs.forEach((o) => o.dispose());
        });
      }
    });

  return {output: outputs[0], cache: newCache};
}
export default function filterComplex(inputs: ReadonlyArray<Asset>, complexFilters: ComplexFilter[]) {
  return filterComplexCached(inputs, complexFilters).output;
}

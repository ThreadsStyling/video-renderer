import Asset from './Asset';
import ComplexFilter from '../shared/ComplexFilter';
import {filters} from './filters';
const faf = require('fast-af/deepEqual');

interface AssetRecord {
  inputs: Asset[];
  filter: ComplexFilter;
  outputs: Asset[];
}

export type FilterCache = {
  recordHash: Map<string, AssetRecord[]>;
  allRecords: Set<AssetRecord>;
};

const getEmptyCache = (): FilterCache => ({recordHash: new Map(), allRecords: new Set()});

export function filterComplexCached(
  inputsAssets: ReadonlyArray<Asset>,
  complexFilters: ComplexFilter[],
  oldCache: FilterCache = getEmptyCache(),
) {
  const sources = new Map<string, Asset>();
  inputsAssets.map((asset, index) => {
    sources.set(`${index}`, asset);
  });

  let defaultInput: Asset | null = inputsAssets[0];
  const newCache: FilterCache = getEmptyCache();

  const getOutputAssets = (inputs: Asset[], filter: ComplexFilter) => {
    let inputsArr = inputs;
    const caches = oldCache.recordHash.get(filter.name);
    const filterCaches = newCache.recordHash.get(filter.name) || [];
    newCache.recordHash.set(filter.name, filterCaches);

    if (caches) {
      for (const cacheItem of caches) {
        if (
          cacheItem.inputs.length === inputsArr.length &&
          cacheItem.inputs.every((input, j) => input === inputsArr[j]) &&
          faf.deepEqual(cacheItem.filter, filter)
        ) {
          filterCaches.push(cacheItem);
          newCache.allRecords.add(cacheItem);
          oldCache.allRecords.delete(cacheItem);

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

    const outputCacheItem = {inputs: inputsArr, filter, outputs: outputsArr};
    filterCaches.push(outputCacheItem);
    newCache.allRecords.add(outputCacheItem);

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

  // Clean cache records that are not present in the new cache
  oldCache.allRecords.forEach((r) => {
    r.outputs.forEach((o) => o.dispose());
  });

  return {output: outputs[0], cache: newCache};
}
export default function filterComplex(inputs: ReadonlyArray<Asset>, complexFilters: ComplexFilter[]) {
  return filterComplexCached(inputs, complexFilters).output;
}

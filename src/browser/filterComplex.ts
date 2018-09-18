import Asset from './Asset';
import ComplexFilter from '../shared/ComplexFilter';
import filterDefinitions from './filters';

export default function filterComplex(inputs: ReadonlyArray<Asset>, filters: ComplexFilter[]) {
  const sources = new Map<string, Asset>();
  inputs.map((asset, index) => {
    sources.set(`${index}`, asset);
  });
  let defaultInput: Asset | null = inputs[0];
  const outputs = filters.reduce<Array<Asset>>((_, filter) => {
    let inputs = (filter.inputs || []).map((input) => {
      const i = typeof input === 'string' ? input : input.name;
      const asset = sources.get(i);
      sources.delete(i);
      if (!asset) {
        throw new Error(`${filter.name}: [${i}] is not provided or has already been used.`);
      }
      return asset;
    });
    const f = filterDefinitions[filter.name];
    if (inputs.length === 0) {
      if (!defaultInput) {
        throw new Error(`${filter.name} does not specify an input, but there is no default input to use.`);
      }
      inputs = [defaultInput];
    }
    const outputAssets = f(inputs, filter.args || {});

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
  return outputs[0];
}

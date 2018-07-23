import ComplexFilter, {FilterInputKind} from '../shared/ComplexFilter';

export default function filterComplex(filters: ComplexFilter[]) {
  return filters
    .map((f) => {
      return `${f.inputs
        .map(
          (i) =>
            `[${i.name}${
              i.kind === FilterInputKind.AudioOnly ? ':a' : i.kind === FilterInputKind.VideoOnly ? ':v' : ''
            }]`,
        )
        .join('')}${f.name}=${Object.keys(f.args)
        .map((name) => `${name}=${f.args[name]}`)
        .join(':')}${f.outputs.map((name) => `[${name}]`).join('')}`;
    })
    .join(',');
}

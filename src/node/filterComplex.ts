import ComplexFilter, {FilterInputKind} from '../shared/ComplexFilter';

export const escapeSpecialChars = (str: string): string =>
  str
    .replace(/\'/g, '\\\\\\\u0027')
    .replace(/,/g, '\\,')
    .replace(/:/g, '\\\\:')
    .replace(/;/g, '\\;');

export const extractFilterArgs = (f: ComplexFilter, name: string) => {
  const value = (f.args || {})[name];
  const argValue = f.name === 'drawtext' && name === 'text' ? escapeSpecialChars(`${value}`) : value;

  return `${name}=${argValue}`;
};

export default function filterComplex(filters: ComplexFilter[]) {
  return filters
    .map((f) => {
      return `${(f.inputs || [])
        .map((i) =>
          typeof i === 'string'
            ? `[${i}]`
            : `[${i.name}${
                i.kind === FilterInputKind.AudioOnly ? ':a' : i.kind === FilterInputKind.VideoOnly ? ':v' : ''
              }]`,
        )
        .join('')}${f.name}=${Object.keys(f.args || {})
        .map((name) => extractFilterArgs(f, name))
        .join(':')}${(f.outputs || []).map((name) => `[${name}]`).join('')}`;
    })
    .join(',');
}

export enum FilterInputKind {
  Both,
  AudioOnly,
  VideoOnly,
}
export interface FilterInput {
  kind: FilterInputKind;
  name: string;
}
export default interface ComplexFilter {
  inputs: FilterInput[];
  outputs: string[];
  name: string;
  args: {
    [key: string]: string | number;
  };
}

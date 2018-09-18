export enum FilterInputKind {
  Both,
  AudioOnly,
  VideoOnly,
}
export interface FilterInput {
  kind: FilterInputKind;
  name: string;
}
export interface ComplexFilter {
  inputs?: Array<FilterInput | string>;
  outputs?: string[];
  name: string;
  args?: {
    [key: string]: string | number;
  };
}

export default ComplexFilter;

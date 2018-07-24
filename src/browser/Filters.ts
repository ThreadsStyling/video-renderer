import Filter from './Filter';

const RegisteredFilters: {[name: string]: Filter} = {};
export function getFilter(name: string): Filter {
  const filter = RegisteredFilters[name];
  if (!filter) {
    throw new Error('Could not find filter: ' + name);
  }
  return filter;
}
export function registerFilter(name: string, filter: Filter) {
  RegisteredFilters[name] = filter;
}

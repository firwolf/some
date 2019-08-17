export const hexadecimal = (length: number) => {
  let result = '';
  let l = length;
  while (l--) result += Math.floor(Math.random() * 16).toString(16);
  return result;
};

export const stripRight = (sym: string, source: string): string =>
  source.substr(-1) === sym.toString() ? source.substr(0, source.length - 1) : source.toString();

export const camelToSnake = (str: string): string =>
  str.trim().replace(/([a-z0-9])([A-Z])/, '$1_$2').toLowerCase();

export const capitalize = (str: string): string => str[0].toUpperCase() + str.slice(1);

export const separateNumberBySpaces = (num: number) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

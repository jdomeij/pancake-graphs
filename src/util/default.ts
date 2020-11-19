import type { FormatTickFunc, FormatValueFunc, ValueInfo } from './../../types';

function valueToString(v: number) {
  if (v === undefined)
    return '';
  return v.toString();
}

function tickToString(v: number, l: string | null) {
  if (typeof l === 'string')
    return l;
  return valueToString(v);
}

export const DefaultFormatValue: FormatValueFunc = valueToString;
export const DefaultFormatTick: FormatTickFunc = tickToString;

import type { FormatTickFunc, FormatValueFunc, ValueInfo } from './typedefs';

function valueToString(v: any) {
  if (v === undefined)
    return '';
  return v.toString();
}

export const DefaultFormatValue: FormatValueFunc = ( (v: number, info: ValueInfo, index: number ): string => v===undefined?'':valueToString(v) );
export const DefaultFormatTick: FormatTickFunc = ( (v: number, l: string | undefined | null, _: boolean): string => (typeof l === 'string'?l:valueToString(v)) );
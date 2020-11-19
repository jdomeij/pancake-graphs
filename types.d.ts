
export interface ValueInfo {
  label: string,
  class?: string,
  color?: string,
  rawRender?: boolean,
}

export interface ValueInfoLine extends ValueInfo {
  fill?: number | boolean;
  line?: number | boolean,
}

export type ValueLabelTick = [i:number, l?:string|null];

export type ValueTick = number | ValueLabelTick;


export type FormatValueFunc =  (value:number, info: ValueInfo, index: number) => string;
export type FormatTickFunc =  (value: number, label: string | null, x: boolean) => string;



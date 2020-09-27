
export interface ValueInfo {
  label: string,
  class?: string,
  color?: string,
  rawRender?: boolean,
}

export interface ValueInfoLine extends ValueInfo {
  fill?: boolean;
  line?: boolean,
}

export type ValueTick = [number, string | null];

export interface FormatValueFunc { (value:number, info: ValueInfo, index: number): string };
export interface FormatTickFunc { (value: number, label: string | null, x: boolean): string };


export interface ValueInfo {
  label: string,
  class?: string | null,
  color?: string | null,
}

export interface ValueInfoLine extends ValueInfo {
  fill?: boolean;
}

export type ValueTick = [number, string | null];

export interface FormatValueFunc { (value:number, info: ValueInfo, index: number): string };
export interface FormatTickFunc { (value: number, label: string | null, x: boolean): string };

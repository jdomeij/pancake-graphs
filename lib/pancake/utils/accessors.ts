
export type PancakePoint = {
  x: number;
  y: number;
};
export type PancakeGetVal = { (d:any, index?: number): number };

export const default_x: PancakeGetVal = (d: any) => d.x;
export const default_y: PancakeGetVal = (d: any) => d.y;

export type PancakeMouse = {
  x: number,
  y: number,
  left: number,
  top: number,
};
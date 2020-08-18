import type { PancakePoint } from './accessors';

export const angleToRadian = (centerX: number, centerY: number, radius:number, degrees:number): PancakePoint => {
  var radians = (degrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(radians)),
    y: centerY + (radius * Math.sin(radians))
  };
};


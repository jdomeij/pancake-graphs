<svelte:options accessors={true} />
<script lang="ts">
  import { tweened } from 'svelte/motion';

  import * as Pancake from '../pancake'; 
  import type { PancakePoint } from '../pancake';
  import Tooltip from '../components/Tooltip.svelte';

  import type {ValueInfo, FormatValueFunc } from '../util/typedefs';
  import { DefaultFormatValue } from '../util/helper';
  import { assertIsArray, assertIsNumber, assertIsString } from '../util/assert';

  interface PieSlice {
    label: string,
    labelPos: PancakePoint,
    value: number,
    offset: number, 
    angle: number,
    class: string,
    style: string,
  };

  // Class to add to chart
  let classStyle: string = '';
  export {classStyle as class};

  // Values
  export let values: number[] = [];

  // Value style information
  export let styles: ValueInfo[] = [];

  // Radius
  export let radius: number = 45;
  
  // Cutout 0-100
  export let cutout: number = 0;

  // Current active slice hovered over 
  export let hoverIndex: number | null = null;

  // Value formatter for tooltip
  export let formatValue: FormatValueFunc = DefaultFormatValue;

  // Percentage of circle to render (0-100)
  export let circleTotal: number = 100;

  // Rendering offset (0-360)
  export let circleOffset: number = 0;

  // Pie edge color
  export let lineColor: string = 'white';

  // Circle center
  export let centerX: number = 50;
  export let centerY: number = 50;

  // Enforce value types
  assertIsArray(values);
  assertIsArray(styles);
  assertIsNumber(radius);
  assertIsNumber(cutout);
  assertIsNumber(circleTotal);
  assertIsNumber(circleOffset);
  assertIsString(lineColor);
  assertIsNumber(centerX);
  assertIsNumber(centerY);

  // Calculate total
  let valuesTotal: number;
  $: valuesTotal = styles.reduce((sum:number, _:ValueInfo, i:number):number=>(sum + (values[i] || 0)), 0);

  // Compensate when only rendering parrt of circle
  let valuesTotalCircle: number;
  $: valuesTotalCircle = (circleTotal === 100 ? valuesTotal : valuesTotal * (100/circleTotal));

  // Calculate rendering info for each slice
  let dataSlices: PieSlice[];
  $: dataSlices = styles.reduce((coll:PieSlice[], _:ValueInfo, i:number): PieSlice[] => {
      let value = values[i] || 0;
      
      // Angle to render
      let angle = 360*(value/valuesTotalCircle);

      // Calculate start rendering position
      let offset = (i > 0) ? (coll[i-1].offset + coll[i-1].angle) : circleOffset;

      let newItem = {
        label: styles[i].label || null,
        labelPos: Pancake.angleToRadian(centerX, centerY, radius/1.5, offset+angle/2),
        offset: offset,
        angle: angle,
        value: value,
        class: styles[i].class || '',
        style: `stroke: ${lineColor};`
      };

      // Add fill color if defined
      if (styles[i].color)
        newItem.style += `color: ${styles[i].color};`;

      coll.push(newItem);

      return coll;
    }, []);

  // Animate resizes
  let angleTween: any = null;

  // Create new when number of slices have changed
  $: angleTween = tweened(styles.map((_:ValueInfo, i:number): [number, number] => {
    if ($angleTween) {
      if ($angleTween[i])
        return $angleTween[i];
      if ($angleTween.length) {
        let tmp = $angleTween[$angleTween.length - 1];
        return [tmp[0]+tmp[1], 360-(tmp[0]+tmp[1])];
      }
    }
    return [0, 0];
  }), {duration:100});
  
  // Update angle value
  $: angleTween.set(dataSlices.map((p)=>[p.angle, p.offset]), $angleTween[0][0]==0?{duration:0}:undefined )

  // Hover
  const onMouseMove = (index: number): void => {
    hoverIndex = index;
  };

  const onMouseLeave = (): void => {
    hoverIndex = null;
  };

  // Safe access to label position
  function getLabelPos(slice:PieSlice, useX: boolean): number {
    if (!slice)
      return 0;
    if (!slice.labelPos)
      return 0;
    return useX ? slice.labelPos.x: 100-slice.labelPos.y;
  }

</script>

<!-- Locked to 0-100 -->
<Pancake.Chart x1={0} x2={100} y1={0} y2={100} class="{classStyle}" >
  <Pancake.Svg clip={true}>
    {#each dataSlices as slice, index}
      <Pancake.SvgPie 
        x={centerX}
        y={centerY}
        angle={$angleTween[index][0]}
        offset={$angleTween[index][1]}
        {radius}
        {cutout}
        let:d
      >
        <path 
          class="pie__slice {slice.class}"
          class:pie__slice--active={hoverIndex === index}
          style={slice.style}
          on:mousemove={()=>(onMouseMove(index))} 
          on:mouseleave={()=>onMouseLeave()}
          {d}
        ></path>
      </Pancake.SvgPie>
    {/each}
  </Pancake.Svg>

  
  {#if hoverIndex !== null && styles[hoverIndex]}
    <Pancake.Point 
      x={Math.max(0, Math.min(getLabelPos(dataSlices[hoverIndex], true), 100))} 
      y={Math.max(0, Math.min(getLabelPos(dataSlices[hoverIndex], false), 100))}
    >
      <slot name="Tooltip">
        <!-- Tooltip -->
        <Tooltip title="{styles[hoverIndex].label || ''}">
          <div class="linechart__tooltip__value">
            { formatValue(values[hoverIndex], styles[hoverIndex], hoverIndex) }
          </div>
        </Tooltip>
      </slot>
    </Pancake.Point>
  {/if}
</Pancake.Chart>

<style type="text/postcss">
  .pie__slice {
    @apply fill-current pointer-events-auto;
    stroke-width: 0.5px;
  }

  .pie__slice--active {
    /*@apply opacity-75;*/
    filter: brightness(75%) saturate(125%);
  }
</style>

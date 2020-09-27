<svelte:options accessors={true} />
<script lang="ts">
  import { tweened } from 'svelte/motion';

  import * as Pancake from '../pancake';
  import type { PancakePoint } from '../pancake';
  import Tooltip from '../components/Tooltip.svelte';

  import type {ValueInfo, FormatValueFunc } from '../util/typedefs';
  import { DefaultFormatValue } from '../util/helper';
  import { assertIsArray, assertIsNumber, assertIsString } from '../util/assert';

  // Style information for each slice
  interface PieStyle {
    id: string,
    label: string,
    class: string,
    lineStyle: string,
    fillStyle: string,
  };

  // Size/Value information for each slice
  interface PieData {
    labelPos: PancakePoint,
    value: number,
    circleStart: number, 
    circleEnd: number, 
    angle: number,
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
  export let lineWidth: number = 1.5;
  export let lineColor: string = 'white';

  // Circle center
  export let centerX: number = 50;
  export let centerY: number = 50;

  export let tooltip: boolean = true;

  // Enforce value types
  assertIsArray('values', values);
  assertIsArray('styles', styles);
  assertIsNumber('radius', radius);
  assertIsNumber('cutout', cutout);
  assertIsNumber('circleTotal', circleTotal);
  assertIsNumber('circleOffset', circleOffset);
  assertIsString('lineColor', lineColor);
  assertIsNumber('centerX', centerX);
  assertIsNumber('centerY', centerY);

  // Calculate total
  let valuesTotal: number;
  $: valuesTotal = styles.reduce((sum:number, _:ValueInfo, i:number):number=>(sum + (values[i] || 0)), 0);

  // Compensate when only rendering part of circle
  let valuesTotalCircle: number;
  $: valuesTotalCircle = (circleTotal === 100 ? valuesTotal : valuesTotal * (100/circleTotal));

  // Calculate rendering info for each slice
  let styleSlices: PieStyle[];
  $: styleSlices = styles.reduce((coll:PieStyle[], _:ValueInfo, i:number): PieStyle[] => {
      let newItem = {
        id: `${styles[i].label || ''}_${i}`, 
        label: styles[i].label || null,
        class: styles[i].class || '',
        lineStyle: `stroke: ${lineColor}; stroke-width: ${lineWidth};`,
        fillStyle: '',
      };

      // Add fill color if defined
      if (styles[i].color)
        newItem.fillStyle += `color: ${styles[i].color};`;

      coll.push(newItem);

      return coll;
    }, []);

  // Calculate rendering info for each slice
  let dataSlices: PieData[];
  $: dataSlices = styles.reduce((coll:PieData[], _:ValueInfo, i:number): PieData[] => {
    let value = values[i] || 0;
    
    // Angle to render
    let angle = 360*(value/valuesTotalCircle);

    // Calculate start rendering position
    let offset = (i > 0) ? (coll[i-1].circleEnd) : circleOffset;

    let newItem = {
      labelPos: Pancake.angleToRadian(centerX, centerY, radius/1.5, offset+angle/2),
      circleStart: offset,
      circleEnd: offset+angle,
      angle: angle,
      value: value,
    };

    coll.push(newItem);

    return coll;
  }, []);


  // Animate resizes
  let angleMotion: any = null;

  // Values or styles changed, calculate new values
  function updateAnimation(_:any, _2:any) {

    // Rendering first time
    if (!angleMotion) {
      // Set new values
      angleMotion = tweened(styles.map((_: any, i: number)=>(dataSlices[i] ? dataSlices[i].circleEnd : 360)));
      return;
    }

    // Column count have changed, create new using old values
    if ($angleMotion.length != styles.length) {
      angleMotion = tweened(styles.map((_: any, i: number)=> ($angleMotion[i] || 360)));
    }

    // Set new values
    angleMotion.set(styles.map((_: any, i: number)=>(dataSlices[i] ? dataSlices[i].circleEnd : 360)));
  }

  // Call function when style or data is changed
  $: updateAnimation(styleSlices, dataSlices);

  // Hover
  const onMouseMove = (index: number): void => {
    if (tooltip === false) return;
    hoverIndex = index;
  };

  const onMouseLeave = (): void => {
    hoverIndex = null;
  };

  // Safe access to label position
  function getLabelPos(slice:PieData, useX: boolean): number {
    if (!slice || !slice.labelPos)
      return 0;
    return Math.max(0, Math.min(useX ? slice.labelPos.x: 100-slice.labelPos.y));
  }

</script>

<!-- Locked to 0-100 -->
<Pancake.Chart x1={0} x2={100} y1={0} y2={100} class="{classStyle}" >

  <!-- SVG element -->
  <Pancake.Svg clip={true}>

    <!-- Hover filter -->
    <!-- Chrome does not support filter on path element so use filter instead -->
    <filter id="pieHoverFilter">
      <!-- Brighten-->
      <feColorMatrix in="SourceGraphic"
          type="matrix"
          values="1.5 0 0 0 0
                  0 1.5 0 0 0
                  0 0 1.5 0 0
                  0 0 0 2 0" />
    </filter> 

    <!-- Each slice -->
    {#each styleSlices as slice, index (slice.id)}
      <Pancake.SvgPie 
        x={centerX}
        y={centerY}
        angle={index?$angleMotion[index]-$angleMotion[index-1]:$angleMotion[index]}
        offset={index?$angleMotion[index-1]:0}
        {radius}
        {cutout}
        let:d
      >
        <!-- Fill style -->
        <path 
          class="pie__slice {slice.class}"
          style={slice.fillStyle}
          filter={hoverIndex===index?'url(#pieHoverFilter)':undefined}
          on:mousemove={()=>(onMouseMove(index))} 
          on:mouseleave={()=>onMouseLeave()}
          {d}
        ></path>
        
        <!-- Edge style, rendered separate -->
        {#if lineWidth > 0}
          <path 
            class="pie__line"
            style={slice.lineStyle}
            {d}
          ></path>
        {/if}
      </Pancake.SvgPie>
    {/each}
  </Pancake.Svg>

  {#if tooltip !== false && hoverIndex !== null && styles[hoverIndex]}
    <Pancake.Point 
      x={ getLabelPos(dataSlices[hoverIndex], true) } 
      y={ getLabelPos(dataSlices[hoverIndex], false) }
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
  .pie__line {
    fill: none; 
    stroke: white;
    stroke-linejoin: round;
    stroke-width: 1.5;
    pointer-events: none;
  }
  .pie__slice {
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 0.5;
    pointer-events: auto;
  }
</style>

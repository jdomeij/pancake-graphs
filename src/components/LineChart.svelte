<svelte:options accessors={true} />
<script lang="ts">

  import { spring } from 'svelte/motion';

  import type { PancakePoint } from '../pancake_lib';
  import * as Pancake from '../pancake_lib';

  import type { ValueInfoLine, ValueTick, ValueLabelTick, FormatValueFunc, FormatTickFunc } from '../../types';
  import Tooltip from './Tooltip.svelte';
  import { DefaultFormatTick, DefaultFormatValue } from '../util/default';
  import { assertIsArray, assertIsArrayArray, assertIsNumber } from '../util/assert';
  
  // Extend point with original index + list index
  interface PancakePointEx extends PancakePoint {
    valIndex: number,
    listIndex: number,
  };

  // Line styles
  export let styles: ValueInfoLine[] = [];

  // Data
  let dataArray: any[] = [];
  export {dataArray as values};

  // Force y-max
  export let yMax: number = 1;

  // Ticks
  export let xTicks: ValueTick[] = [];
  export let yTicks: ValueTick[] = [];

  // Color for y-ticks (override)
  export let yTicksColor: string = undefined;

  // Tooltip title
  export let tooltipTitle: string | null = null;

  // Enable tooltip
  export let tooltip: boolean = true;

  // Format func for tooltip values
  export let formatValue: FormatValueFunc = DefaultFormatValue;

  // Format func for tick values
  export let formatTick: FormatTickFunc = DefaultFormatTick;

  // Enforce value types
  assertIsArrayArray('dataArray', dataArray);
  assertIsArray('styles', styles);
  assertIsNumber('yMax', yMax);
  assertIsArray('xTicks', xTicks);
  assertIsArray('yTicks', yTicks);

  // Closest point to the mouse pointer
  let closest: PancakePointEx | null = null;

  // XY points + index
  let pointsData: PancakePointEx[][];
  $: pointsData = dataArray.map( (dataVal:any[], listIndex: number): PancakePointEx[] => {
    assertIsArray('dataArray[]', dataVal);
    return dataVal.map( (val:number, valIndex:number): PancakePointEx => ({
      x: valIndex, 
      y: val,
      valIndex,
      listIndex,
    }));
  });

  // All XY points in one array
  let pointsDataAll: PancakePointEx[];
  $: pointsDataAll = pointsData.reduce( (coll:PancakePointEx[], points:PancakePointEx[]): PancakePointEx[] => {
    return coll.concat(points);
  }, []);


  // Calculate ticks labels
  let xTicksLabels: ValueLabelTick[];
  $: xTicksLabels = xTicks.map((item: ValueTick): ValueLabelTick => (typeof item==='number'?[item, null]:item));

  let yTicksLabels: ValueLabelTick[];
  $: yTicksLabels = yTicks.map((item: ValueTick): ValueLabelTick => (typeof item==='number'?[item, null]:item));

  // Calculate max value for the ticks
  let xMaxTicks: number;
  $: xMaxTicks = xTicksLabels.reduce( (prev:number, p:ValueLabelTick)=>(prev > p[0]?prev:p[0]), 0) || 10;

  let yMaxTicks: number;
  $: yMaxTicks = yTicksLabels.reduce( (prev:number, p:ValueLabelTick)=>(prev > p[0]?prev:p[0]), 0) || 10;

  // Use zero values for min values
  let yMin: number = 0;
  let xMin: number = 0;

  // Max value for x-axis
  let xMaxCalc: number = 0;
  $: xMaxCalc = Math.max.apply(null, [xMaxTicks, ...pointsDataAll.map((p)=>p.x)] );

  // Max value for y-axis (ignores value data)
  let yMaxCalc: number = 0;
  $: yMaxCalc = Math.max(yMax, yMaxTicks);

  // Calculate y-ticks line positions
  let yTicksLines: PancakePoint[][];
  $: yTicksLines = yTicksLabels.map( (p:ValueLabelTick): PancakePoint[] => {
    return [
      {x:xMin, y:p[0]},
      {x:xMaxCalc, y:p[0]}
    ];
  });

  // Calculate style for y-axis
  let yLinesStyle: string;
  $: yLinesStyle = yTicksColor? `color: ${yTicksColor};`:'';

  // No delay on mouse enter
  let noAnimateDelay: boolean = true;

  // Add tweening interpolation
  const pointAnimate = spring([0, 0, ...styles.map(()=>0)], {
    stiffness: 0.3,
    damping: 0.8,
  });

  // Mouse movement
  $: ((point: PancakePointEx) => {
    let duration = undefined;

    // Mouse leave
    if (!point) {
      noAnimateDelay = true;
      return;
    }

    // Mouse enter (no-delay)
    if (noAnimateDelay) {
      duration = {hard: true};
      noAnimateDelay = false;
    }

    // Interpolate points
    pointAnimate.set([point.x, point.y, ...pointsData.map(p=>p[point.valIndex]?.y||0)], duration);
  })(closest);

  // Update intersection line
  let xLine: PancakePoint[] = [];
  $: xLine = [{x:$pointAnimate[0], y:yMin}, {x:$pointAnimate[0], y:yMaxCalc}];

  // Limit y-value to be inside graph
  function containValueY(val: number) {
    if (val > yMaxCalc)
      return yMaxCalc;
    if (val < yMin)
      return yMin;
    return val;
  }

  // Generate style information
  function formatStyle(style: ValueInfoLine, graph: boolean): string {
    let retVal = ''
    if (style.color)
      retVal += `color: ${style.color};`;
      
    if (graph && style.fill !== false) {
      if (typeof style.fill === 'number')
        retVal += `opacity: ${style.fill}`;
      else
        retVal += `opacity: 0.25;`;
    }
    return retVal;
  }
  
  // Generate style information
  function formatLineStyle(style: ValueInfoLine): string {
    let retVal = ''
    if (style.color)
      retVal += `color: ${style.color};`;
    if (typeof style.line === 'number')
      retVal += `stroke-width: ${style.line};`;
    return retVal;
  }
</script>


<Pancake.Chart x1={xMin} x2={xMaxCalc} y1={yMin} y2={yMaxCalc}>
  <Pancake.Svg clip={true}>
    <!-- Grid line y-axis -->
    {#each yTicksLines as yLine}
       <Pancake.SvgLine data={yLine} let:d>
        <path style={yLinesStyle} class="linechart__y-axis__gridline" {d}></path>
      </Pancake.SvgLine>
    {/each}

    <!-- Each data line -->
    {#each pointsData as points, i}
      <!-- Data line stroke -->
      {#if styles[i].line !== false && styles[i].line !== 0 }
        <Pancake.SvgLine data={points} let:d>
          <path 
            class="linechart__data__line {styles[i].class || ''}"
            style={formatLineStyle(styles[i])}
            {d}
          ></path>
        </Pancake.SvgLine>
      {/if}

      <!-- Data line fill -->
      {#if styles[i].fill !== false }
        <Pancake.SvgArea data={points} let:d>
          <path 
            class="linechart__data__area {styles[i].class || ''}" 
            style={formatStyle(styles[i], true)}
            {d}
          ></path>
        </Pancake.SvgArea>
      {/if}
    {/each}

    {#if tooltip && closest !== null}
      <!-- Intersection line -->
      <Pancake.SvgLine data={xLine} let:d>
        <path class="linechart__x-axis__line" {d}></path>
      </Pancake.SvgLine>
    {/if}
  </Pancake.Svg>

  <!-- y-axis ticks -->
  <Pancake.Grid horizontal ticks={yTicksLabels.map(p=>p[0])} let:index let:value>
    <span class="linechart__y-axis__text">{formatTick(value, yTicksLabels[index][1], true)}</span>
  </Pancake.Grid>

  <!-- x-axis ticks -->
  <Pancake.Grid vertical ticks={xTicksLabels.map(p=>p[0])} let:index let:value>
    <span class="linechart__x-axis__text">{formatTick(value, xTicksLabels[index][1], false)}</span>
  </Pancake.Grid>

  {#if tooltip && closest !== null}
    <!-- Tooltip rendering -->
    <Pancake.Point x={$pointAnimate[0]} y={containValueY($pointAnimate[1])}>
      <Tooltip title={tooltipTitle} left={$pointAnimate[0] > xMaxCalc*.8}>
        {#each dataArray as _, i}
          {#if styles[i].rawRender}
            {@html formatValue((pointsData[i][closest.valIndex] ? pointsData[i][closest.valIndex].y : 0), styles[i], i) }
          {:else}
            <div class="linechart__tooltip__row">
              {#if dataArray.length > 1}
                <span class="linechart__tooltip__icon {styles[i].class || ''}" style={formatStyle(styles[i], false)}></span>
              {/if}
              <span class="linechart__tooltip__value">{formatValue((pointsData[i][closest.valIndex] ? pointsData[i][closest.valIndex].y : 0), styles[i], i) }</span>
            </div>
          {/if}
        {/each}
      </Tooltip>
    </Pancake.Point>

    <!-- Intersection point (one for each data line) -->
    {#each dataArray as _, i}
      <Pancake.Point x={$pointAnimate[0]} y={containValueY($pointAnimate[i+2])}>
        <span class="linechart__circle {styles[i].class || ''}" style={formatStyle(styles[i], false)}></span>
      </Pancake.Point>
    {/each}
  {/if}

  {#if tooltip}
    <!-- Find closest point -->
    <Pancake.Quadtree data={pointsDataAll} bind:closest/>
  {/if}
</Pancake.Chart>


<style type="text/postcss">
  .default_color {
    @apply text-blue-500;
  }

  .linechart__y-axis__gridline {
    stroke: theme('colors.gray.400');
    shape-rendering: crispedges;
    opacity: .5;
    stroke-dasharray: 2;
    stroke-width: 1;
  }

  .linechart__y-axis__text, 
  .linechart__x-axis__text {
    font-size: 9px;
    @apply antialiased text-gray-700 font-semibold font-sans;
    @apply pointer-events-none;
  }


  .linechart__y-axis__text {
    @apply absolute -ml-2; 
    @apply transform -translate-y-1/2 -translate-x-full;

  }

  .linechart__x-axis__text {
    @apply absolute bottom-0; 
    @apply transform -translate-x-1/2 translate-y-full;
  }

  .linechart__data__line {
    fill: none; 
    stroke: currentColor;
    stroke-linejoin: round;
    stroke-width: 2;
  }

  .linechart__data__area {
    @apply fill-current;
    stroke: none;
  }
  
  .linechart__x-axis__line {
    @apply text-gray-600 stroke-current stroke-1 opacity-25;
    shape-rendering: crispedges;
  }

  .linechart__circle {
    @apply p-0;
    @apply absolute inset-0 inline-block pointer-events-none;
    @apply bg-transparent border rounded-full border-current opacity-75;
    
    margin-top: -4px;
    margin-left: -4px;
    width: 8px;
    height: 8px;
  }

  .linechart__tooltip__row {
    @apply flex flex-row text-gray-700 justify-start;
  }

  .linechart__tooltip__icon {
    @apply inline-block border-2 w-4 h-4 mt-1 mr-2 rounded-sm;
    @apply bg-current border-current;
  }

  .linechart__tooltip__value {
  }
</style>
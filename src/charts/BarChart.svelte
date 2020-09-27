<svelte:options accessors={true} />
<script lang="ts">
  import * as Pancake from '../pancake'; 
  import { tweened } from 'svelte/motion';
  import type { PancakePoint } from '../pancake';
  import Tooltip from '../components/Tooltip.svelte'
  import type {ValueInfo, ValueTick, FormatValueFunc, FormatTickFunc } from '../util/typedefs';
  import { DefaultFormatTick, DefaultFormatValue } from '../util/helper';
  import { assertIsArray, assertIsNumber } from '../util/assert';

  // Bar styles
  export let styles: ValueInfo[] = [];

  // Data
  export let values: number[] = [];

  // Force x-max value
  export let xMax: number = 1;

  // x-ticks
  export let xTicks: ValueTick[] = [];

  // Height 0-100%
  export let height: number = 75;

  // Tooltip value formatter
  export let formatValue: FormatValueFunc = DefaultFormatValue;

  // Label formatter
  export let formatTick: FormatTickFunc = DefaultFormatTick;

  // Enforce value types
  assertIsArray('values', values);
  assertIsArray('styles', styles);
  assertIsNumber('xMax', xMax);
  assertIsArray('xTicks', xTicks);
  assertIsNumber('height', height);

  // Use zero values for min values
  let xMin: number = 0;
  let yMin = 0;

  // Calculate x-max
  let xMaxCalc: number;
  $: xMaxCalc = Math.max.apply(null, [xMax, ...values, ...xTicks.map(p=>p[0])]);

  // Number of bars
  let yMaxCalc = styles.length;

  // Calculate XY-points
  let dataXY: PancakePoint[];
  $: dataXY = styles.map( (_,index:number)=>({x:values[index]||0, y:index}) );

  // Animate changes
  let dataAnimate: any = tweened(styles.map((_: any, i: number)=>(values[i] || 0)));

  // Values or styles changed, calculate new values
  function updateAnimation(_:any, _2:any) {

    // Column count have changed, create new using old values
    if ($dataAnimate.length != styles.length) {
      dataAnimate = tweened(styles.map((_: any, i: number)=> ($dataAnimate[i] || 0)));
    }

    // Set new values
    dataAnimate.set(styles.map((_: any, i: number)=>(values[i] || 0)));
  }

  $: updateAnimation(styles, values);


  // Calculate x-ticks
  let xLines: PancakePoint[][];
  $: xLines = xTicks.map((p:ValueTick):PancakePoint[]=>{
    return [
      {x:p[0], y:yMin},
      {x:p[0], y:yMaxCalc}
    ];
  });

  // Calculate x-scale line
  let yLine:PancakePoint[];
  $: yLine = [
    {x:0, y:0}, 
    {x:xMaxCalc, y:0}
  ];

  // Current hover index
  let hoverIndex: number | null = null;
  function setHoverIndex(i: number) {
    hoverIndex = i;
  }

  // y-label strings
  let yLabels: string[] = styles.map( (p:ValueInfo, i:number) :string => (formatTick(i, p.label, false)) );

</script>

<Pancake.Chart x1={xMin} x2={xMaxCalc} y1={yMin} y2={yMaxCalc}>
  <div class="overflow-hidden">
    <Pancake.Bars data={$dataAnimate} x={p=>p} y={(_,i)=>i} height={height/100} let:index>
      <div 
        class="barchart__bar {styles[index].class||''}"
        class:barchart__bar--active={hoverIndex===index} 
        style="{styles[index].color?`color: ${styles[index].color};`: ''}"
        on:mousemove="{()=>(setHoverIndex(index))}" 
        on:mouseout="{()=>(setHoverIndex(null))}"
      ></div>
    </Pancake.Bars>
  </div>

  <Pancake.Grid horizontal ticks={yLabels.map((_,i)=>i)} let:index>
    <span 
      class="barchart__y-text text-gray-700 text-xs"
      class:barchart__y-text--active={hoverIndex===index} 
      on:mousemove="{()=>(setHoverIndex(index))}" 
      on:mouseout="{()=>(setHoverIndex(null))}"
    >{formatTick(index, yLabels[index], false)}</span>
  </Pancake.Grid>

  <Pancake.Grid vertical ticks={xTicks.map(p=>p[0])} let:index>
    <span class="barchart__x-text">{formatTick(xTicks[index][0], xTicks[index][1], true)}</span>
  </Pancake.Grid>

  <Pancake.Svg>
    {#each xLines as xLine}
      <Pancake.SvgLine data={xLine} let:d>
        <path class="barchart__x-line" {d}></path>
      </Pancake.SvgLine>
    {/each}

    <Pancake.SvgLine data={yLine} let:d>
      <path class="barchart__y-line" {d}></path>
    </Pancake.SvgLine>
  </Pancake.Svg>

  {#if hoverIndex !== null}
    <Pancake.Point x={dataXY[hoverIndex].x} y={dataXY[hoverIndex].y}>
      <Tooltip title={styles[hoverIndex].label||''}>
        <div class="barchart__tooltip__value">
          { formatValue(dataXY[hoverIndex].x, styles[hoverIndex], hoverIndex) }
        </div>
      </Tooltip>
    </Pancake.Point>
  {/if}
</Pancake.Chart>

<style type="text/postcss">
  .barchart__x-line,
  .barchart__y-line {
    stroke: black;
    stroke-width: 0.5;
  }

  .barchart__x-line {
    opacity: .25;
    stroke-dasharray: 1;
  }

  .barchart__y-line {
    opacity: .5;
    stroke-dasharray: 2;
  }

  .barchart__y-text,
  .barchart__x-text {
    @apply antialiased text-gray-700 font-normal cursor-default;
  }

  .barchart__y-text {
    @apply w-16 text-right truncate;
    @apply inline-block -ml-2 leading-5; 
    @apply transform -translate-x-full -translate-y-full;
  }

  .barchart__y-text--active {
  }

  .barchart__x-text {
    @apply absolute bottom-0; 
    @apply transform -translate-x-1/2 translate-y-full;
  }

  .linechart__tooltip__value {
    @apply flex flex-row text-gray-600;
  }

  .barchart__bar {
    @apply h-full w-full bg-current m-0 p-0 border-current border outline-none;
    @apply transform -translate-y-1/2;
  }
  
  .barchart__bar--active {
    filter: brightness(75%) saturate(125%);
  }
</style>

<svelte:options accessors={true} />
<script lang="ts">

  import * as Pancake from '../pancake';
  import type { PancakePoint } from '../pancake';

  import { tweened } from 'svelte/motion';
  import Tooltip from '../components/Tooltip.svelte';
  import type {ValueInfoLine, ValueTick, FormatValueFunc, FormatTickFunc } from '../util/typedefs';
  import { DefaultFormatTick, DefaultFormatValue } from '../util/helper';
  import { assertIsArray, assertIsArrayArray, assertIsNumber } from '../util/assert';

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
  assertIsArrayArray(dataArray);
  assertIsArray(styles);
  assertIsNumber(yMax);
  assertIsArray(xTicks);
  assertIsArray(yTicks);

  type PancakePointEx = {
    x: number,
    y: number,
    valIndex: number,
    listIndex: number,
  };

  // Closest point to the mouse pointer
  let closest: PancakePointEx | null = null;

  // XY points + index
  let pointsData: PancakePointEx[][];
  $: pointsData = dataArray.map( (dataVal:any[], listIndex: number): PancakePointEx[] => {
    assertIsArray(dataVal);
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

  // Calculate max value for the ticks
  let xMaxTicks: number;
  let yMaxTicks: number;
  $: xMaxTicks = xTicks.reduce( (prev:number, p:ValueTick)=>{return prev > p[0]?prev:p[0];}, 0) || 10;
  $: yMaxTicks = yTicks.reduce( (prev:number, p:ValueTick)=>{return prev > p[0]?prev:p[0];}, 0) || 10;

  // Use zero values for min values
  let xMin: number = 0;
  let yMin: number = 0;

  // Max value for x-axis
  let xMaxCalc: number = 0;
  $: xMaxCalc = Math.max.apply(null, [xMaxTicks, ...pointsDataAll.map((p)=>p.x)] );

  // Max value for y-axis (ignores value data)
  let yMaxCalc: number = 0;
  $: yMaxCalc = Math.max(yMax, yMaxTicks);

  // Calculate lines for y-axis
  let yLines: PancakePoint[][] = [];
  $: yLines = yTicks.map((line:any):PancakePoint[]=>{
    return [
      {x:xMin, y:line[0]},
      {x:xMaxCalc, y:line[0]},
    ];
  });

  // Calculate style for y-axis
  let yLinesStyle: string;
  $: yLinesStyle = yTicksColor? `color: ${yTicksColor};`:'';

  // No delay on mouse enter
  let noTweenDelay: boolean = true;
  const xPointTween = tweened(1, {
    duration: 50,
  });
  const yPointTween = tweened(1, {
    duration: 100,
  });

  // Mouse movement
  function xLineUpdate(point: PancakePoint) {
    // Mouse leave
    if (!point) {
      noTweenDelay = true;
      return;
    }

    // Mouse enter (no-delay)
    if (noTweenDelay) {
      xPointTween.set(point.x, {duration:0});
      yPointTween.set(point.y, {duration:0});
      noTweenDelay = false;
      return;
    }

    // Interpolate
    $xPointTween = point.x;
    $yPointTween = point.y;
  }

  // Update intersection point
  $: xLineUpdate(closest);

  // Update intersection line
  let xLine: PancakePoint[] = [];
  $: xLine = [{x:$xPointTween, y:yMin}, {x:$xPointTween, y:yMaxCalc}];

  // Limit y-value to be inside graph
  function containValueY(val: number) {
    if (val > yMaxCalc)
      return yMaxCalc;
    if (val < yMin)
      return yMin;
    return val;
  }

  // Generate style information
  function formatStyle(style: ValueInfoLine): string {
    let retVal = ''
    if (style.color)
      retVal += `color: ${style.color};`;
    return retVal;
  }
</script>


<Pancake.Chart x1={xMin} x2={xMaxCalc} y1={yMin} y2={yMaxCalc}>
  <Pancake.Svg>
    {#each yLines as yLine}
       <Pancake.SvgLine data={yLine} let:d>
        <path style={yLinesStyle} class="linechart__y-axis__gridline" {d}></path>
      </Pancake.SvgLine>
    {/each}

    {#each pointsData as points, i}
      <Pancake.SvgLine data={points} let:d>
        <path 
          class="linechart__data__line {styles[i].class || ''}"
          style='fill: none; {formatStyle(styles[i])}'
          {d}
        ></path>
      </Pancake.SvgLine>

      {#if styles[i].fill !== false }
        <Pancake.SvgArea data={points} let:d>
          <path 
            class="linechart__data__area {styles[i].class || ''}" 
            style='stroke: none; {formatStyle(styles[i])}'
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

  <Pancake.Grid horizontal ticks={yTicks.map(p=>p[0])} let:index>
    <span class="linechart__y-axis__text">{formatTick(yTicks[index][0], yTicks[index][1], true)}</span>
  </Pancake.Grid>

  <Pancake.Grid vertical ticks={xTicks.map(p=>p[0])} let:index>
    <span class="linechart__x-axis__text">{formatTick(xTicks[index][0], xTicks[index][1], false)}</span>
  </Pancake.Grid>

  {#if tooltip && closest !== null}
    <!-- Tooltip rendering -->
    <Pancake.Point x={$xPointTween} y={containValueY($yPointTween)}>
      <Tooltip title={tooltipTitle} left={$xPointTween > xMaxCalc*.8}>
        {#each dataArray as _, i}
          <div class="linechart__tooltip__row">
            {#if dataArray.length > 1}
              <span class="linechart__tooltip__icon {styles[i].class || ''}" style={formatStyle(styles[i])}></span>
            {/if}
            <span class="linechart__tooltip__value">{ formatValue((pointsData[i][closest.valIndex] ? pointsData[i][closest.valIndex].y : 0), styles[i], i) }</span>
          </div>
        {/each}
      </Tooltip>
    </Pancake.Point>

    <!-- Intersection point (one for each data line) -->
    {#each dataArray as _, i}
      <Pancake.Point x={$xPointTween} y={containValueY(pointsData[i][closest.x].y)}>
        <span class="linechart__circle {styles[i].class || ''}" style={formatStyle(styles[i])}></span>
      </Pancake.Point>
    {/each}
  {/if}

  {#if tooltip}
    <!-- Set y-axis to zero to only use x-axis -->
    <Pancake.QuadtreeNormalized data={pointsDataAll} bind:closest/>
  {/if}
</Pancake.Chart>


<style type="text/postcss">
  .default_color {
    @apply text-blue-500;
  }

  .linechart__y-axis__gridline {
    @apply text-gray-400 stroke-current stroke-1;
    stroke-dasharray: 2;
  }

  .linechart__y-axis__text, 
  .linechart__x-axis__text {
    font-size: 9px;
    @apply antialiased text-gray-600 font-semibold font-sans;
    @apply pointer-events-none;
  }


  .linechart__y-axis__text {
    @apply absolute -ml-2; 
    @apply transform -translate-y-full -translate-x-full;

  }

  .linechart__x-axis__text {
    @apply absolute bottom-0; 
    @apply transform -translate-x-1/2 translate-y-full;
  }

  .linechart__data__line {
    @apply stroke-current;
    stroke-line: currentColor;
    stroke-linejoin: round;
    stroke-width: 1px;
  }

  .linechart__data__area {
    @apply fill-current opacity-25;
  }
  
  .linechart__x-axis__line {
    @apply text-gray-600 stroke-current stroke-1 opacity-25;
  }

  .linechart__circle {
    @apply -mt-1 -ml-1 w-2 h-2 p-0;
    @apply absolute inset-0 inline-block pointer-events-none;
    @apply bg-transparent border rounded-full border-current opacity-75;
  }

  .linechart__tooltip__title {
    @apply block font-semibold text-gray-900;
  }

  .linechart__tooltip__row {
    @apply flex flex-row text-gray-600;
  }

  .linechart__tooltip__icon {
    @apply inline-block border-2 w-4 h-4 mt-1 mr-2 rounded-sm;
    @apply bg-current border-current;
  }

  .linechart__tooltip__value {
  }
</style>
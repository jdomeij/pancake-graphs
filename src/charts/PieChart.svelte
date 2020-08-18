<svelte:options accessors={true} />
<script lang="ts">
  import Pie from './Pie.svelte';
  import type {ValueInfo, FormatValueFunc } from '../util/typedefs';
  import { assertIsArray, assertIsNumber, assertIsString } from '../util/assert';

   // Class to add to chart
  export let classChart: string = '';

   // Class to add to legend
  export let classLegend: string = '';

  // Values
  export let values: number[] = [];

  // Value style information
  export let styles: ValueInfo[] = [];

  // Radius
  export let radius:number = undefined;

  // Cutout 0-100
  export let cutout:number = undefined;

  // Render legend to left
  export let leftLegend:boolean = false;

  // Percentage of circle to render (0-100)
  export let circleTotal: number = undefined;

  // Rendering offset (0-360)
  export let circleOffset: number = undefined;

  // Render legend in reverse order
  export let reverseLegend: boolean = false;

  // Pie edge color
  export let lineColor: string = undefined;

  // Value formatter for tooltip
  export let formatValue: FormatValueFunc = undefined;

  // Circle center
  export let centerX: number = undefined;
  export let centerY: number = undefined;

  // Enforce value types
  assertIsArray(values);
  assertIsArray(styles);

  // Current active slice
  let hoverIndex: number | null = null;

  // Mouse hover
  const onMouseMove = (index: number): void => {
    hoverIndex = index;
  };

  const onMouseLeave = (): void => {
    hoverIndex = null;
  };

</script>

<!-- SVG Pie -->
<Pie 
  bind:hoverIndex={hoverIndex}
  {values}
  {radius}
  {cutout}
  {styles}
  class={classChart}
  {centerX}
  {centerY}
  {circleTotal}
  {circleOffset}
  {lineColor}
  {formatValue}
></Pie>

<!-- Legend -->
<div class="piechart__legend {classLegend}"
    class:piechart__legend--normal={!reverseLegend}
    class:piechart__legend--reverse={reverseLegend}
    class:piechart__legend--left={leftLegend}
    class:piechart__legend--right={!leftLegend}
>
  {#each styles as style, index}
    {#if style.label}
      <div 
        class="piechart__row"
        class:piechart__row--active={hoverIndex === index}
        on:mousemove={()=>(onMouseMove(index))} 
        on:mouseleave={()=>onMouseLeave()}
      >
        <span class="piechart__icon {style.class||''}" style={style.color?`color:${style.color};`:''}></span>
        <span class="piechart__label">{style.label||''}</span>
      </div>
    {/if}
  {/each}
</div>

<style type="text/postcss">
  .piechart__legend {
    @apply p-2 absolute top-0 text-sm font-semibold flex;
    @apply overflow-hidden;
  }

  .piechart__legend--normal {
    @apply flex-col justify-start;
  }

  .piechart__legend--reverse {
    @apply flex-col-reverse justify-end;
  }

  .piechart__legend--left {
    @apply left-0 top-0 transform -translate-x-full;
  }

  .piechart__legend--right {
    @apply right-0 top-0 transform translate-x-full;
  }

  .piechart__row {
    @apply flex px-2 leading-normal flex-row items-center text-gray-600 rounded-sm cursor-default;
  }

  .piechart__row--active {
    @apply bg-gray-500 text-gray-800;
  }

  .piechart__icon {
    @apply inline-block w-3 h-3 mr-1 rounded-sm flex-shrink-0 bg-current;
  }

  .piechart__label {
    @apply truncate min-w-0;
  }

</style>

<script lang="ts">
  export let title: string | null = null;
  export let left: boolean = false;

</script>

<div 
  class="tooltip"
  class:tooltip--left={left}
>
  {#if title}
    <strong class="tooltip__title">{title}</strong>
  {/if}
  <slot></slot>
</div>

<style type="text/postcss">
  .tooltip {
    @apply absolute ml-4 p-1 hidden bg-white;
    @apply border border-blue-500 rounded-sm shadow;
    @apply text-sm text-gray-700 whitespace-no-wrap font-normal;
    @apply px-2 max-w-xl z-30 inline-block;
    @apply pointer-events-none;
    @apply transform -translate-y-1/2;
  }

  .tooltip.tooltip--left {
    @apply -translate-x-full -ml-4;
  }

  .tooltip__title {
    @apply block font-semibold text-gray-900;
  }
</style>
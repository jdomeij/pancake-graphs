<script lang="ts">
  import { getChartContext } from './Chart.svelte';
	import type { PancakeGetVal } from '../utils/accessors';
	import { default_x, default_y } from '../utils/accessors';

	const { x_scale, y_scale } = getChartContext();

	export let data: any[];
	export let x: PancakeGetVal = default_x;
	export let y: PancakeGetVal = default_y;

	let d: string;
	$: d = 'M' + data
		.map((d, i) => `${$x_scale(x(d, i))},${$y_scale(y(d, i))}`)
		.join('L');
</script>

<slot {d}></slot>
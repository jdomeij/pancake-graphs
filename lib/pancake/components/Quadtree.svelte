<script lang="ts">
	import { getChartContext } from './Chart.svelte';
	import Quadtree from '../utils/Quadtree'
	import type { PancakeGetVal, PancakePoint } from '../utils/accessors';
	import { default_x, default_y } from '../utils/accessors';

	export let data: object[];
	export let x: PancakeGetVal = default_x;
	export let y: PancakeGetVal = default_y;
	export let radius: number = undefined;

	// exposing the prop lets consumers use let: or bind:
	export let closest: PancakePoint | null = null;

	const { pointer } = getChartContext();

	let quadtree: Quadtree;
	$: quadtree = new Quadtree(data, x, y); // TODO map data here so we don't need to pass accessors around, and accessors can access index
	$: closest = $pointer ? quadtree.find($pointer.x, $pointer.y, radius) : null;
</script>

<slot {closest}></slot>
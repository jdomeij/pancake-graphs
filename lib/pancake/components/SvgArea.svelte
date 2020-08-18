<script lang="ts">
	import SvgPolygon from './SvgPolygon.svelte';
	import type { PancakeGetVal, PancakePoint } from '../utils/accessors';
	import { default_x, default_y } from '../utils/accessors';

	export let data: any[];
	export let floor: number = 0;
	export let x: PancakeGetVal = default_x;
	export let y: PancakeGetVal = default_y;

	let points: PancakePoint[];
	$: points = [
		{ x: x(data[0], 0), y: floor },
		...data.map((d, i) => ({ x: x(d, i), y: y(d, i) })),
		{ x: x(data[data.length - 1], data.length - 1), y: floor }
	];
</script>

<SvgPolygon data={points} let:d>
	<slot {d}></slot>
</SvgPolygon>
<script lang="ts">
	import { getChartContext } from './Chart.svelte';
	import { get_ticks } from '../utils/ticks';

	export let count: number = undefined;
	export let ticks: any[] = undefined;
	export let horizontal: boolean = false;
	export let vertical: boolean = false;

	const { x1, y1, x2, y2, x_scale, y_scale } = getChartContext();

	enum Direction {
		VERTICAL,
		HORIZONTAL,
	};

	let orientation: Direction;
	$: orientation = vertical ? Direction.VERTICAL : Direction.HORIZONTAL;

	$: if (horizontal && vertical) {
		console.error(`<Grid> must specify either 'horizontal' or 'vertical' orientation`);
	}

	let _ticks: any[];
	$: _ticks = ticks || (orientation === Direction.HORIZONTAL
		? get_ticks($y1, $y2, count)
		: get_ticks($x1, $x2, count));

	let style: (n:any, i:number)=>string;
	$: style = orientation === Direction.HORIZONTAL
		? (n:any, i:number): string => `width: 100%; height: 0; top: ${$y_scale(n, i)}%`
		: (n:any, i:number): string => `width: 0; height: 100%; left: ${$x_scale(n, i)}%`;
</script>

<div class="pancake-grid">
	{#each _ticks as tick, i}
		<div class="pancake-grid-item" style={style(tick, i)}>
			<slot value={tick} index={i} first={i === 0} last={i === _ticks.length - 1}></slot>
		</div>
	{/each}
</div>

<style>
	.pancake-grid-item {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
<script lang="ts" context="module">
	import { getContext } from 'svelte';

	export interface PancakeContext {
		x1: Writable<number>,
		x2: Writable<number>,
		y1: Writable<number>,
		y2: Writable<number>,
		x_scale: SvelteStore<any>,
		y_scale: SvelteStore<any>,
		x_scale_inverse: SvelteStore<any>,
		y_scale_inverse: SvelteStore<any>,
		pointer: Writable<PancakeMouse|null>,
		width: Writable<number>,
		height: Writable<number>,
	}

	const key = {};

	export function getChartContext(): PancakeContext {
		return getContext(key);
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable, derived } from 'svelte/store';
	import type { PancakeMouse } from '../utils/accessors';
	import * as yootils from 'yootils';

	let className:string = '';
	export {className as class};

	export let x1:number = 0;
	export let y1:number = 0;
	export let x2:number = 1;
	export let y2:number = 1;

	let chart: HTMLElement;
	

	const _x1: Writable<number> = writable(0);
	const _y1: Writable<number> = writable(0);
	const _x2: Writable<number> = writable(1);
	const _y2: Writable<number> = writable(1);

	let widthNum: number = undefined;
	let heightNum: number = undefined;
	const width: Writable<number|undefined> = writable(undefined);
	const height: Writable<number|undefined> = writable(undefined);

	const pointer: Writable<PancakeMouse|null> = writable(null);

	const onMouseMove = (e: MouseEvent): void => {
		const bcr: DOMRect = chart.getBoundingClientRect();
		const left: number = e.clientX - bcr.left;
		const top: number = e.clientY - bcr.top;

		const x = $x_scale_inverse(100 * left / (bcr.right - bcr.left));
		const y = $y_scale_inverse(100 * top / (bcr.bottom - bcr.top));

		pointer.set({ x, y, left, top });
	};

	const onMouseLeave = (_: MouseEvent): void => {
		pointer.set(null);
	};

	$: _x1.set(x1);
	$: _y1.set(y1);
	$: _x2.set(x2);
	$: _y2.set(y2);

	const x_scale = derived([_x1, _x2], ([$x1, $x2]) => {
		return yootils.linearScale([$x1, $x2], [0, 100]);
	});

	const y_scale = derived([_y1, _y2], ([$y1, $y2]) => {
		return yootils.linearScale([$y1, $y2], [100, 0]);
	});

	const x_scale_inverse  = derived(x_scale, $x_scale => $x_scale.inverse());
	const y_scale_inverse  = derived(y_scale, $y_scale => $y_scale.inverse());

	$: width.set(widthNum);
	$: height.set(heightNum);

	setContext(key, {
		x1: _x1,
		y1: _y1,
		x2: _x2,
		y2: _y2,
		x_scale,
		y_scale,
		x_scale_inverse,
		y_scale_inverse,
		pointer,
		width,
		height,
	});
</script>

<div 
	class="pancake-chart {className}" 
	bind:this={chart}
	bind:clientWidth={widthNum}
	bind:clientHeight={heightNum}
	on:mousemove={onMouseMove} 
	on:mouseleave={onMouseLeave}>
	<slot></slot>
</div>

<style>
	.pancake-chart {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
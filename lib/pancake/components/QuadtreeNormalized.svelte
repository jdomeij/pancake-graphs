<script lang="ts">
	import { getChartContext } from './Chart.svelte';
	import Quadtree from '../utils/Quadtree'
	import type { PancakeGetVal } from '../utils/accessors';
	import { default_x, default_y } from '../utils/accessors';

	interface XYPointNormalized {
		x: number,
		y: number, 
		point: any,
	};

	export let data: object[];
	export let x: PancakeGetVal = default_x;
	export let y: PancakeGetVal = default_y;
	export let radius: number = undefined;
	
	let xyRatio: number = 1;

	// exposing the prop lets consumers use let: or bind:
	export let closest: object | null = null;

	const { pointer, x1, x2, y1, y2, width, height } = getChartContext();

	let xNorm: number;
	let yNorm: number;
	$: xNorm = $x2-$x1||1;
	$: yNorm = $y2-$y1||1;

	function xNormCalc(val: number): number{
		return ((val - $x1)/xNorm)*100*xyRatio;
	}

	function yNormCalc(val: number): number{
		return ((val - $y1)/yNorm)*100;
	}

	let dataNorm: XYPointNormalized[] | null = null; 
	let quadtree: Quadtree | null = null;

	// On data change, clear quadtree and normalized data
	function quadTreeClear(...args: any[]) {
		quadtree = null;
		dataNorm = null;
	}
	$: quadTreeClear(data, $width, $height);

	// Creates quadtree and normalized data if needed
	// Find closest point
	function quadTreeFind(pointX: number, pointY: number, dataIn: object[]) {
		xyRatio = $width && $height ? $width/$height: 1;
		
		// Normalized XY point
		let pointXNorm: number = xNormCalc(pointX);
		let pointYNorm: number = yNormCalc(pointY);

		// Regenerate normalized data
		if (dataNorm === null) {
			dataNorm = dataIn.map((point: any):XYPointNormalized => {
				let xNorm: number = xNormCalc(x(point));
				let yNorm: number = yNormCalc(y(point));

				return {
					x: xNorm,
					y: yNorm,
					point: point,
				};
			});
		}

		// Create new Quadtree with normalized data
		if (quadtree === null) {
			quadtree = new Quadtree(dataNorm, x, y);
		}

		// Find closest point
		return quadtree.find(pointXNorm, pointYNorm, radius)
	}

	// Calc closest normalized point and from it get closest original point
	let closestNorm: XYPointNormalized;
	$: closestNorm = $pointer ? quadTreeFind($pointer.x, $pointer.y, data) : null;

	// Convert normalized to real value
	$: closest = closestNorm != null ? closestNorm.point : null; 
</script>

<slot {closest}></slot>
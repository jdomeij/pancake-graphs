<script lang="ts">
	import Box from './Box.svelte';
	import type { PancakeGetVal } from '../utils/accessors';
	import { default_x, default_y } from '../utils/accessors';

	export let data:any[];
	export let width:number = 1;
	export let x:PancakeGetVal = default_x;
	export let y:PancakeGetVal = default_y;
</script>

{#each data as d, i}
	<Box x1="{x(d, i) - width/2}" x2="{x(d, i) + width/2}" y1={0} y2="{y(d, i)}">
		<slot value={d} first="{i === 0}" last="{i === data.length - 1}"/>
	</Box>
{/each}
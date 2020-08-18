<script lang="ts">
	let className:string = 'clip';
	export {className as class};

	export let style: string = '';
	export let clip: boolean = true;
	export let noPointerEvents: boolean = true;
</script>

<svg 
	viewBox="0 0 100 100" 
	preserveAspectRatio="none"
	class:pancake-clip={clip}
	class:pancake-no-pointer-events={noPointerEvents}
	class='pancake-svg {className}'
	{style}
>
	<slot></slot>
</svg>

<style>
	.pancake-svg {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.pancake-clip {
		overflow: hidden;
	}

	.pancake-no-pointer-events {
		pointer-events: none;
	}

	.pancake-svg :global(*) {
		vector-effect: non-scaling-stroke;
	}
</style>


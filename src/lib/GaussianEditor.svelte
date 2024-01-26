<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import { type IGaussian } from '$lib';
	export let selectedGaussian: IGaussian;

	let width = selectedGaussian.width;
	let center = selectedGaussian.center;
	let height = selectedGaussian.height;

	$: {
		width = selectedGaussian.width;
		center = selectedGaussian.center;
		height = selectedGaussian.height;
	}

	$: {
		dispatch('update', {width, center, height});
	}

	const dispatch = createEventDispatcher();

	function updateObject(event: Event) {
		dispatch('update', { width, center, height });
	}
</script>

<RangeSlider
	name="range-slider-center"
	bind:value={selectedGaussian.center}
	max={1.0}
	step={0.01}
	min={0.0}
	ticked
	on:change={updateObject}
>
	<div class="flex justify-between items-center">
		<div class="font-bold">Center</div>
		<div class="text-xs">{selectedGaussian.center}</div>
	</div>
</RangeSlider>
<RangeSlider
	name="range-slider-height"
	bind:value={selectedGaussian.height}
	max={1.0}
	step={0.01}
	min={0.0}
	ticked
	on:change={updateObject}
>
	<div class="flex justify-between items-center">
		<div class="font-bold">Height</div>
		<div class="text-xs">{selectedGaussian.height}</div>
	</div>
</RangeSlider>
<RangeSlider
	name="range-slider-width"
	bind:value={selectedGaussian.width}
	max={1.0}
	step={0.01}
	min={0.0}
	ticked
	on:change={updateObject}
>
	<div class="flex justify-between items-center">
		<div class="font-bold">Width</div>
		<div class="text-xs">{selectedGaussian.width}</div>
	</div>
</RangeSlider>

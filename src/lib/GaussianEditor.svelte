<script lang="ts">
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

	const dispatch = createEventDispatcher();

	function updateObject(event: Event) {
		dispatch('update', { width, center, height });
	}
</script>

<div class="slider">
	<label for="center">Center:</label>
	<input
		type="range"
		id="center"
		min="0"
		max="1.0"
		step="0.01"
		bind:value={selectedGaussian.center}
		on:input={updateObject}
	/>
</div>

<div class="slider">
	<label for="height">Height:</label>
	<input
		type="range"
		id="height"
		min="0"
		max="1.0"
		step="0.01"
		bind:value={selectedGaussian.height}
		on:input={updateObject}
	/>
</div>

<div class="slider">
	<label for="width">Width:</label>
	<input
		type="range"
		id="width"
		min="0"
		max="1.0"
		step="0.01"
		bind:value={selectedGaussian.width}
		on:input={updateObject}
	/>
</div>

<style>
	.slider {
		width: 100%;
		margin-bottom: 1rem;
	}
</style>

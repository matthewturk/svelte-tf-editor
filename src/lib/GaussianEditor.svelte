<script>
	import { createEventDispatcher } from 'svelte';
	export let selectedGaussian;

	let gaussian = {
		center: selectedGaussian.center || 0,
		height: selectedGaussian.height || 0,
		width: selectedGaussian.width || 0
	};

	const dispatch = createEventDispatcher();

	function updateObject(event) {
		selectedGaussian = { ...gaussian };
		dispatch('update', selectedGaussian);
	}
</script>

<div class="slider">
	<label for="center">Center:</label>
	<input
		type="range"
		id="center"
		min="0"
		max="256"
		bind:value={gaussian.center}
		on:input={updateObject}
	/>
</div>

<div class="slider">
	<label for="height">Height:</label>
	<input
		type="range"
		id="height"
		min="0"
		max="256"
		bind:value={gaussian.height}
		on:input={updateObject}
	/>
</div>

<div class="slider">
	<label for="width">Width:</label>
	<input
		type="range"
		id="width"
		min="0"
		max="256"
		bind:value={gaussian.width}
		on:input={updateObject}
	/>
</div>

<style>
	.slider {
		width: 100%;
		margin-bottom: 1rem;
	}
</style>

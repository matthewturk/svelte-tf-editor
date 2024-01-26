<script lang="ts">
	import GaussianEditor from './GaussianEditor.svelte';
	import { type IGaussian } from '$lib';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PlusCircle, MinusCircle } from '@steeze-ui/heroicons';
	import * as d3Chromatic from 'd3-scale-chromatic';
	export let gaussians: IGaussian[] = [{ width: 0.5, center: 0.5, height: 0.2 }];

	import ColormapDisplay from './ColormapDisplay.svelte';
	let selectedGaussian: IGaussian = gaussians[0];
	let itemIndex = 0;
    let colorMap: string = 'Viridis';

	function handleUpdate(event: CustomEvent<IGaussian>) {
		selectedGaussian = event.detail;
		gaussians[itemIndex] = selectedGaussian;
		gaussians = [...gaussians];
	}
	function handleIndexUpdate(event: CustomEvent<number>) {
		selectGaussian(event.detail);
	}

	function deleteGaussian() {
		gaussians.splice(itemIndex, 1);
		gaussians = [...gaussians];
		if (!gaussians.length) {
			addGaussian();
		} else {
			itemIndex = Math.max(itemIndex - 1, 0);
			selectedGaussian = gaussians[itemIndex];
		}
	}

	function addGaussian() {
		const newGaussian = { width: 0.5, center: 0.5, height: 0.2 };
		gaussians = [...gaussians, newGaussian];
		selectedGaussian = newGaussian;
		itemIndex = gaussians.length - 1;
	}
	function selectGaussian(index: number) {
		selectedGaussian = gaussians[index];
		itemIndex = index;
	}
</script>

<div class="w-1/3 m-3 p-2">
	<div class="h-full space-y-4 w-full relative">
		<select class="select" bind:value={colorMap}>
			{#each Object.keys(d3Chromatic).filter(v => v.startsWith("interpolate")) as item, index}
				<option value="{item.slice(11)}">{item.slice(11)}</option>
			{/each}
		</select>
		<select class="select" size="4" bind:value={itemIndex}>
			{#each gaussians as item, index}
				<option value={index}>{index}: {item.center}, {item.height}, {item.width}</option>
			{/each}
		</select>
		<button type="button" class="btn-icon variant-filled m-2" on:click={addGaussian}
			><Icon src={PlusCircle} theme="solid" class="text-primary-500" /></button
		>
		<button type="button" class="btn-icon variant-filled m-2" on:click={deleteGaussian}
			><Icon src={MinusCircle} theme="solid" class="text-primary-500" /></button
		>
		<GaussianEditor {selectedGaussian} on:update={handleUpdate} />
	</div>
</div>
<div class="w-2/3 m-3 p-2">
	<ColormapDisplay {gaussians} {colorMap} on:updateIndex={handleIndexUpdate} on:update={handleUpdate} />
</div>

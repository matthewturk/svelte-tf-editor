<script lang="ts">
	import { type IVMInput } from '$lib/vm';
	import VariableMesh from '$lib/VariableMesh.svelte';
	import MouseEventContainer from '$lib/MouseEventContainer.svelte';
	import { onMount } from 'svelte';
	import { Canvas, LayerCake } from 'layercake';
	import { colormaps } from '$lib/store';

	let min_val: number | undefined = undefined;
	let max_val: number | undefined = undefined;
	let take_log: boolean = false;
	let x_low = 0.0;
	let x_high = 1.0;
	let y_low = 0.0;
	let y_high = 1.0;
	let fieldName: string = '';
	let colormapName = 'Viridis';

	let vmInput: IVMInput;

	let xDomain: [number, number] = [0.0, 1.0];
	let yDomain: [number, number] = [0.0, 1.0];

	$: {
		[x_low, x_high] = xDomain;
	}
	$: {
		[y_low, y_high] = yDomain;
	}

	async function fetchTypedArray(url: string): Promise<Float64Array> {
		const response = await fetch(url);
		const buffer = await response.arrayBuffer();
		return new Float64Array(buffer, 0, buffer.byteLength / 8);
	}

	onMount(async () => {
		vmInput = {
			px: await fetchTypedArray('/vm_px.bin'),
			py: await fetchTypedArray('/vm_py.bin'),
			pdx: await fetchTypedArray('/vm_pdx.bin'),
			pdy: await fetchTypedArray('/vm_pdy.bin'),
			fields: {
				density: await fetchTypedArray('/vm_density.bin')
			}
		};
	});
</script>

<div class="w-full h-[500px] flex flex-row">
	<div class="w-1/4 h-[500px] m-2 p-2">
		<select class="select">
			{#if vmInput?.fields}
				{#each Object.keys(vmInput.fields) as field}
					<option value={field}>{field}</option>
				{/each}
			{/if}
		</select>
		<label for="take_log">Take log</label>
		<input type="checkbox" name="take_log" class="checkbox" bind:checked={take_log} />
		<select class="select" bind:value={colormapName}>
			{#each Object.keys(colormaps) as colormap}
				<option value={colormap}>{colormap}</option>
			{/each}
		</select>
	</div>
	<div class="w-3/4 h-[500px] m-2 p-2">
		{#if vmInput}
			<div class="h-[500px] w-[500px]">
				<LayerCake {xDomain} {yDomain}>
					<MouseEventContainer bind:xDomain bind:yDomain>
						<Canvas>
							<VariableMesh
								{vmInput}
								{min_val}
								{max_val}
								{take_log}
								{x_low}
								{x_high}
								{y_low}
								{y_high}
								{fieldName}
								{colormapName}
							/></Canvas
						></MouseEventContainer
					>
				</LayerCake>
			</div>
		{/if}
	</div>
</div>

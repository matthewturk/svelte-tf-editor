<script lang="ts">
	import { type IVMInput } from '$lib/vm';
	import VariableMesh from '$lib/VariableMesh.svelte';
	import MouseEventContainer from '$lib/MouseEventContainer.svelte';
	import { onMount } from 'svelte';
	import { Canvas, Axis, Chart, Svg } from 'layerchart';
	import { colormaps } from '$lib/store';
	import { SlideToggle } from '@skeletonlabs/skeleton';

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
		<SlideToggle name="take_log" bind:checked={take_log}>Take Log</SlideToggle>
		<select class="select" bind:value={colormapName}>
			{#each Object.keys(colormaps) as colormap}
				<option value={colormap}>{colormap}</option>
			{/each}
		</select>
		<div>{xDomain[0]} - {xDomain[1]}</div>
		<div>{yDomain[0]} - {yDomain[1]}</div>
	</div>
	<div class="w-3/4 h-[500px] m-2 p-2">
		{#if vmInput}
			<div class="h-[500px] w-[500px]">
				<Chart {xDomain} {yDomain} padding={{ right: 32, bottom: 32 }}>
					<Svg
						><Axis placement="right" rule />
						<Axis placement="bottom" rule /></Svg
					>
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
				</Chart>
			</div>
		{/if}
	</div>
</div>

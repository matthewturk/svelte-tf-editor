<script lang="ts">
	import { VariableMesh, FixedResolutionBuffer } from '@data-exp-lab/yt-tools';
	import { type VMInput } from '$lib/vm';
	import { onMount } from 'svelte';
	import { colormapCollection } from './ColormapDisplay.svelte';
	let vm: VariableMesh;
	export let width = 128;
	export let height = 128;
	export let x_low = 0.0;
	export let x_high = 1.0;
	export let y_low = 0.0;
	export let y_high = 1.0;
	export let variableMeshData: VMInput | null = null;
	export let fieldName: string = '';
	export let colormapName = 'Viridis';
	let buffer: Float64Array;
	let imageBuffer: Uint8ClampedArray;
	let imageData: ImageData;
	const knownFields: string[] = [];
	let vmCanvas: HTMLCanvasElement;

	$: {
		if (variableMeshData) {
			vm = new VariableMesh(
				variableMeshData.px,
				variableMeshData.py,
				variableMeshData.pdx,
				variableMeshData.pdy
			);
			for (const [field, values] of Object.entries(variableMeshData.fields)) {
				knownFields.push(field);
				vm.add_field(field, values);
				if (fieldName === '') {
					fieldName = field;
				}
			}
		}
	}

	$: {
		buffer = new Float64Array(width * height);
		imageBuffer = new Uint8ClampedArray(width * height * 4);
	}

	$: {
		const frb = new FixedResolutionBuffer(width, height, x_low, x_high, y_low, y_high);
		frb.deposit(vm, buffer, fieldName);
		if (vmCanvas) {
			imageData = vmCanvas.getContext('2d')?.createImageData(width, height);
		}
	}
</script>

<canvas bind:this={vmCanvas}></canvas>

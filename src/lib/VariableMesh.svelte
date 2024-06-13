<script lang="ts" context="module">
	import { VariableMesh, FixedResolutionBuffer } from '@data-exp-lab/yt-tools';
	import { colormapCollection } from '$lib/store';
</script>

<script lang="ts">
	import { type IVMInput } from '$lib/vm';
	import { getContext } from 'svelte';
	import { scaleCanvas } from 'layercake';
	let vm: VariableMesh;
	export let min_val: number | undefined = undefined;
	export let max_val: number | undefined = undefined;
	export let take_log: boolean = false;
	export let x_low = 0.0;
	export let x_high = 1.0;
	export let y_low = 0.0;
	export let y_high = 1.0;
	export let vmInput: IVMInput | null = null;
	export let fieldName: string = '';
	export let colormapName = 'Viridis';
	let buffer: Float64Array;
	let imageBuffer: Uint8Array;
	let imageData: ImageData;
	const knownFields: string[] = [];
	let vmCanvas: HTMLCanvasElement;
	const { width, height } = getContext('LayerCake');
	const { ctx } = getContext('canvas');

	$: {
		if (vmInput) {
			vm = new VariableMesh(vmInput.px, vmInput.py, vmInput.pdx, vmInput.pdy);
			for (const [field, values] of Object.entries(vmInput.fields)) {
				knownFields.push(field);
				vm.add_field(field, values);
				if (fieldName === '') {
					fieldName = field;
				}
			}
		}
	}

	$: {
		buffer = new Float64Array($width * $height);
		imageBuffer = new Uint8Array($width * $height * 4);
	}
	$: {
		console.log('Made FRB', $width, $height);
		const frb = new FixedResolutionBuffer($width, $height, x_low, x_high, y_low, y_high);
		frb.deposit(vm, buffer, fieldName);
	}
	$: {
		if ($ctx) {
			console.log('image data');
			imageData = $ctx.createImageData($width, $height);
		}
	}

	$: {
		$colormapCollection.normalize(colormapName, buffer, imageBuffer, min_val, max_val, take_log);
		console.log('normalized');
		if (imageData) {
			console.log('setting data', $width, $height);
			imageData.data.set(imageBuffer);
			createImageBitmap(imageData).then((imageBitmap) => {
				if ($ctx) {
					scaleCanvas($ctx, $width, $height);
					$ctx.clearRect(0, 0, $width, $height);
					$ctx.drawImage(imageBitmap, 0, 0, $width, $height);
				}
			});
		}
	}
</script>

<script lang="ts">
	import { getContext } from 'svelte';

	const { xScale, yScale, width, height } = getContext('LayerCake');

	let element: HTMLElement;
	let dragging: boolean = false;
	let dragStart: [number, number] = [0, 0];
	let dragStartCenter: [number, number] = [0.5, 0.5];

	export let xDomain: [number, number];
	export let yDomain: [number, number];

	function handleClick(e) {
		const rect = element.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		console.log('Element coordinates', x, y);
		console.log('Data coordinates', $xScale.invert(x), $yScale.invert(y));
	}

	function startDrag(e: MouseEvent) {
		console.log('startDrag', e.offsetX, e.offsetY);
		dragging = true;
		dragStart = [e.offsetX, e.offsetY];
		dragStartCenter = [(xDomain[0] + xDomain[1]) / 2, (yDomain[0] + yDomain[1]) / 2];
	}

	function stopDrag(e: MouseEvent) {
		console.log('stopDrag', e.offsetX, e.offsetY);
		dragging = false;
	}
	function conductDrag(e: MouseEvent) {
		if (!dragging) return;
		const shiftValue: [number, number] = [e.offsetX - dragStart[0], e.offsetY - dragStart[1]];
		// Now we shift the actual center
		const view_width: [number, number] = [xDomain[1] - xDomain[0], yDomain[1] - yDomain[0]];
		const dx = view_width[0] / $width; // note these are FRB dims, which are *pixel* dims, not display dims
		const dy = -view_width[1] / $height; // origin is upper left, so flip dy
		const new_view_center: [number, number] = [
			dragStartCenter[0] - dx * shiftValue[0],
			dragStartCenter[1] - dy * shiftValue[1]
		];
		xDomain = [new_view_center[0] - view_width[0] / 2, new_view_center[0] + view_width[0] / 2];
		yDomain = [new_view_center[1] - view_width[1] / 2, new_view_center[1] + view_width[1] / 2];
	}

	function handleWheel(e: WheelEvent) {
		const center = [(xDomain[0] + xDomain[1]) / 2, (yDomain[0] + yDomain[1]) / 2];
		const view_width: [number, number] = [xDomain[1] - xDomain[0], yDomain[1] - yDomain[0]];
		let n_units: number = 0;
		if (e.deltaMode === e.DOM_DELTA_PIXEL) {
			// let's say we have 9 units per image
			n_units = e.deltaY / ($width / 10);
		} else if (e.deltaMode === e.DOM_DELTA_LINE) {
			// two lines per unit let's say
			n_units = e.deltaY / 2;
		} else if (e.deltaMode === e.DOM_DELTA_PAGE) {
			// yeah i don't know
			return;
		}
		const zoomFactor: number = 1.1 ** n_units;
		const new_view_width: [number, number] = [
			view_width[0] * zoomFactor,
			view_width[1] * zoomFactor
		];
		xDomain = [center[0] - new_view_width[0] / 2, center[0] + new_view_width[0] / 2];
		yDomain = [center[1] - new_view_width[1] / 2, center[1] + new_view_width[1] / 2];
	}
</script>

<svelte:window on:mouseup={stopDrag} />

<div
	bind:this={element}
	class="w-full h-full"
	on:wheel={handleWheel}
	on:click={handleClick}
	on:mousedown={startDrag}
	on:mousemove={conductDrag}
>
	<slot />
</div>

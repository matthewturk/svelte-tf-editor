<script lang="ts">
	import { getContext } from 'svelte';

	const { xScale, yScale } = getContext('LayerCake');

	let element;

	function handleClick(e) {
		const rect = element.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		console.log('Element coordinates', x, y);
		console.log('Data coordinates', $xScale.invert(x), $yScale.invert(y));
	}

	function startDrag(e: MouseEvent) {
		console.log('startDrag', e.offsetX, e.offsetY);
	}

	function stopDrag(e: MouseEvent) {
		console.log('stopDrag', e.offsetX, e.offsetY);
	}

	function handleWheel(e: WheelEvent) {
		console.log('handleWheel', e.deltaY, e.deltaMode);
		const xBounds = $xScale.domain();
		const yBounds = $yScale.domain();
		const center = [(xBounds[0] + xBounds[1]) / 2, (yBounds[0] + yBounds[1]) / 2];
		const view_width: [number, number] = [xBounds[1] - xBounds[0], yBounds[1] - yBounds[0]];
		console.log(center, view_width);
		let n_units: number = 0;
		if (e.deltaMode === e.DOM_DELTA_PIXEL) {
			// let's say we have 9 units per image
			console.log('dom delta pixel');
			n_units = e.deltaY / (10 * view_width[0]);
		} else if (e.deltaMode === e.DOM_DELTA_LINE) {
			// two lines per unit let's say
			console.log('dom delta line');
			n_units = e.deltaY / 2;
		} else if (e.deltaMode === e.DOM_DELTA_PAGE) {
			// yeah i don't know
			console.log('dom delta page');
			return;
		}
		const zoomFactor: number = 1.1 ** n_units;
		console.log(zoomFactor, n_units);
		const new_view_width: [number, number] = [
			view_width[0] * zoomFactor,
			view_width[1] * zoomFactor
		];
		console.log(xScale);
		xScale.set(
			$xScale.domain([center[0] - new_view_width[0] / 2, center[0] + new_view_width[0] / 2])
		);
		yScale.set(
			$yScale.domain([center[1] - new_view_width[1] / 2, center[1] + new_view_width[1] / 2])
		);
		console.log($xScale.domain(), $yScale.domain());
	}
</script>

<div
	bind:this={element}
	class="w-full h-full"
	on:wheel={handleWheel}
	on:click={handleClick}
	on:mousedown={startDrag}
	on:mouseup={stopDrag}
>
	<slot />
</div>

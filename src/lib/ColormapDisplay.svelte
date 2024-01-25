<script lang="ts">
    import { type IGaussian } from '$lib';
	export let gaussians: IGaussian[] = [];
	let initialized = false;
	let svg: SVGSVGElement;

	function getColor(x: number) {
		// Define your color mapping function here
		// Example: linearly interpolate between red and blue
		const r = Math.floor(255 * (1 - x));
		const b = Math.floor(255 * x);
		return `rgb(${r}, 0, ${b})`;
	}

	let canvas: HTMLCanvasElement;

	function drawCurves(gaussians: IGaussian[]) {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(0, canvas.height);
		ctx.scale(1, -1);

		for (const gaussian of gaussians) {
			const { width, height, center } = gaussian;
			const startX = center - width / 2;
			const endX = center + width / 2;

			for (let x = startX; x <= endX; x += 1) {
				const t = (x - startX) / (endX - startX);
				const y = height * (1 - (2 * t - 1) ** 2);

				ctx.fillStyle = getColor(x / canvas.width);
				ctx.fillRect(x, 0, 1, y);
			}
		}
		ctx.restore();
	}

	let dragging = false;
	let x = 50;
	let y = 50;

	function startDrag(event: MouseEvent) {
		dragging = true;
		event.preventDefault();
	}

	function doDrag(event: MouseEvent) {
		if (dragging) {
			if(!svg) return;
			let point = svg.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			let ctm = svg.getScreenCTM();
			if (!ctm) return;
			let transformed = point.matrixTransform(ctm.inverse());
			x = transformed.x;
			y = transformed.y;
		}
	}
	function stopDrag(event: MouseEvent) {
		dragging = false;
	}

	$: {
		if (canvas) {
			drawCurves(gaussians);
		}
	}
</script>

<div style="position: relative;">
	<canvas bind:this={canvas} />
	<svg bind:this={svg}>
		{#each gaussians as item, index}
			<g id="gaussian-{index}">
				<line
					x1={item.center}
					y1="0"
					x2={item.center}
					y2="256"
					stroke="white"
					stroke-width="3"
					aria-label="Draggable line"
					aria-grabbed={dragging}
					role="slider"
					aria-valuenow={item.center}
					tabindex=0
					on:mousedown={startDrag}
					on:mousemove={doDrag}
					on:mouseup={stopDrag}
					on:mouseleave={stopDrag}
				/>
			</g>
		{/each}
	</svg>
</div>

<style>
	canvas {
		width: 512px;
		height: 256px;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 0;
	}
	svg {
		width: 512px;
		height: 256px;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}
</style>

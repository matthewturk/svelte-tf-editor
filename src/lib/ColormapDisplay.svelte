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
	let dragIndex = 0;

	function drawCurves(gaussians: IGaussian[]) {
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(0, canvas.height);
		ctx.scale(1, -1);

		for (const gaussian of gaussians) {
			const { width, height, center } = gaussian;
			const startX = canvas.width * (center - width / 2);
			const endX = canvas.width * (center + width / 2);

			for (let x = startX; x <= endX; x += 1) {
				const t = (x - startX) / (endX - startX);
				const y = canvas.height * height * (1 - (2 * t - 1) ** 2);

				ctx.fillStyle = getColor(x / canvas.width);
				ctx.fillRect(x, 0, 1, y);
			}
		}
		ctx.restore();
	}

	let dragging = false;
	let x = 0.5;
	let y = 0.5;

	function startDrag(event: MouseEvent, index: number) {
		console.log('Starting drag');
		dragging = true;
		event.preventDefault();
		dragIndex = index;
	}

	function doDrag(event: MouseEvent) {
		if (dragging) {
			if (!svg) return;
			let point = svg.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			let ctm = svg.getScreenCTM();
			if (!ctm) return;
			let transformed = point.matrixTransform(ctm.inverse());
			gaussians[dragIndex].center = transformed.x;
			y = transformed.y;
			gaussians = [...gaussians];
		}
	}
	function stopDrag(event: MouseEvent) {
		console.log('Stopping', event);
		dragging = false;
	}

	let dimensions: DOMRect | null;

	function getDimensions() {
		dimensions = svg.getBoundingClientRect();
	}

	$: {
		if (canvas) {
			getDimensions();
			drawCurves(gaussians);
		}
	}
</script>
<p>{dimensions?.width}</p>
<p>{dimensions?.height}</p>

<div class="w-full h-64 relative">
	<canvas bind:this={canvas} class="w-full h-full absolute inset-0 z-0" />
	<svg
		bind:this={svg}
		class="w-full h-full absolute inset-0 z-10"
		on:mouseleave={stopDrag}
		on:mousemove={doDrag}
		on:mouseup={stopDrag}
		on:blur={stopDrag}
		tabindex="-1"
		role="figure"
	>
		{#each gaussians as item, index}
			<g id="gaussian-{index}">
				<line
					x1={dimensions?.width * item.center}
					y1={dimensions?.height * (1.0 - item.height)}
					x2={dimensions?.width * item.center}
					y2={dimensions?.height}
					stroke="white"
					stroke-width="3"
					aria-label="Draggable line"
					aria-grabbed={dragging}
					role="slider"
					aria-valuenow={item.center}
					tabindex="0"
					on:mousedown={(event) => startDrag(event, index)}
				/>
				<circle cx={dimensions?.width * item.center} cy={dimensions?.height * (1.0 - item.height)} r="5" fill="white"/>
			</g>
		{/each}
	</svg>
</div>

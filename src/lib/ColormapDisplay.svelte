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

	let draggingCenter = false;
	let draggingWidth = false;
	let draggingCircle = false;

	function startDraggingCenterCircle(event: MouseEvent, index: number) {
		draggingCircle = true;
		startDraggingCenter(event, index);
	}

	function startDraggingWidth(event: MouseEvent, index: number) {
		draggingWidth = true;
		draggingCenter = false;
		dragIndex = index;
		event.preventDefault();
	}

	function startDraggingCenter(event: MouseEvent, index: number) {
		draggingCenter = true;
		draggingWidth = false;
		dragIndex = index;
		event.preventDefault();
	}

	function doDrag(event: MouseEvent) {
		if (draggingCenter) {
			if (!svg) return;
			let point = svg.createSVGPoint();
			point.x = event.clientX;
			point.y = event.clientY;
			let ctm = svg.getScreenCTM();
			if (!ctm) return;
			let transformed = point.matrixTransform(ctm.inverse());
			gaussians[dragIndex].center = transformed.x / dimensions?.width;
			if (draggingCircle) {
				gaussians[dragIndex].height = 1.0 - transformed.y / dimensions?.height;
			}
			gaussians = [...gaussians];
		} else if (draggingWidth) {
			let point = svg.createSVGPoint();
			point.x = event.clientX;
			let ctm = svg.getScreenCTM();
			if (!ctm) return;
			let transformed = point.matrixTransform(ctm.inverse());
			gaussians[dragIndex].width = Math.abs(
				2*(gaussians[dragIndex].center - transformed.x / dimensions?.width)
			);
			gaussians = [...gaussians];
		}
	}
	function stopDrag(event: Event) {
		draggingCenter = false;
		draggingWidth = false;
	}

	let dimensions: DOMRect = {
		width: 0,
		height: 0,
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		toJSON: () => ''
	};

	function getDimensions(svg: SVGSVGElement) {
		console.log('Getting dimensions');
		dimensions = svg.getBoundingClientRect();
	}

	$: {
		if (canvas) {
			getDimensions(svg);
			drawCurves(gaussians);
		}
	}
</script>

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
				<g id="gaussian-{index}-center">
					<line
						x1={dimensions?.width * item.center}
						y1={dimensions?.height * (1.0 - item.height)}
						x2={dimensions?.width * item.center}
						y2={dimensions?.height}
						stroke="white"
						stroke-width="3"
						aria-label="Draggable line"
						aria-grabbed={draggingCenter}
						role="slider"
						aria-valuenow={item.center}
						tabindex="0"
						on:mousedown={(event) => startDraggingCenter(event, index)}
					/>
					<circle
						cx={dimensions?.width * item.center}
						cy={dimensions?.height * (1.0 - item.height)}
						r="5"
						fill="white"
						on:mousedown={(event) => startDraggingCenterCircle(event, index)}
					/>
				</g>
				<g id="gaussian-{index}-width">
					<line
						x1={dimensions?.width * (item.center - item.width / 2)}
						y1={dimensions?.height}
						x2={dimensions?.width * (item.center + item.width / 2)}
						y2={dimensions?.height}
						stroke="white"
						stroke-width="3"
					/>
					<circle
						cx={dimensions?.width * (item.center - item.width / 2)}
						cy={dimensions?.height}
						r="5"
						fill="white"
						on:mousedown={(event) => startDraggingWidth(event, index)}
					/>
					<circle
						cx={dimensions?.width * (item.center + item.width / 2)}
						cy={dimensions?.height}
						r="5"
						fill="white"
						on:mousedown={(event) => startDraggingWidth(event, index)}
					/>
				</g>
			</g>
		{/each}
	</svg>
</div>

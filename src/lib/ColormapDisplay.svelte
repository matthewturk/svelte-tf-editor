<script lang="ts">
	export let gaussians = [];
	let initialized = false;

	function getColor(x) {
		// Define your color mapping function here
		// Example: linearly interpolate between red and blue
		const r = Math.floor(255 * (1 - x));
		const b = Math.floor(255 * x);
		return `rgb(${r}, 0, ${b})`;
	}

	let canvas: HTMLCanvasElement;

	function drawCurves(gaussians) {
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
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

	$: {
		if (canvas) {
			drawCurves(gaussians);
		}
	}
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		width: 512px;
		height: 256px;
	}
</style>

import { writable } from 'svelte/store';
import { ColormapCollection } from '@data-exp-lab/yt-tools';
import * as d3Chromatic from 'd3-scale-chromatic';
import * as d3Color from 'd3-color';
export const colormaps: { [key: string]: (t: number) => string } = {
	Viridis: d3Chromatic.interpolateViridis,
	Inferno: d3Chromatic.interpolateInferno,
	Magma: d3Chromatic.interpolateMagma,
	Blues: d3Chromatic.interpolateBlues
};
function initializeColormaps() {
	const newCollection = new ColormapCollection();

	for (const [colormap, interpolator] of Object.entries(colormaps)) {
		const rgbArray = new Uint8Array(256 * 4);
		for (let i = 0; i < 256; i++) {
			const rgb = d3Color.color(interpolator(i / 255));
			if (rgb === null) {
				throw new Error('rgb is null');
			}
			rgbArray[i * 4] = rgb.rgb().r;
			rgbArray[i * 4 + 1] = rgb.rgb().g;
			rgbArray[i * 4 + 2] = rgb.rgb().b;
			rgbArray[i * 4 + 3] = 255;
		}
		newCollection.add_colormap(colormap, rgbArray);
	}
	return newCollection;
}

export const colormapCollection = writable<ColormapCollection>(initializeColormaps());

<script lang="ts">

	import GaussianEditor from './GaussianEditor.svelte';
    import { type IGaussian } from '$lib';
	export let gaussians: IGaussian[] = [
        { width: 0.5, center: 0.5, height: 0.2 }
    ];

    import ColormapDisplay from './ColormapDisplay.svelte';
	let selectedGaussian: IGaussian = gaussians[0];
    let itemIndex = 0;

	function handleUpdate(event: CustomEvent<IGaussian>) {
        selectedGaussian = event.detail;
        gaussians[itemIndex] = selectedGaussian;
        gaussians = [...gaussians];
    }
    function handleIndexUpdate(event: CustomEvent<number>) {
        selectGaussian(event.detail);
    }

    function addGaussian() {
        const newGaussian = {width: 0.5, center: 0.5, height: 0.2};
        gaussians = [...gaussians, newGaussian];
        selectedGaussian = newGaussian;
        itemIndex = gaussians.length - 1;
    }
    function selectGaussian(index:number) {
        selectedGaussian = gaussians[index];
        itemIndex = index;
    }
</script>

<div class="w-1/3">
 <select class="select" bind:value={itemIndex}>
	{#each gaussians as item, index}
    <option value={index}>{index}: {item.width}, {item.center}, {item.height}</option>
	{/each}
</select>
    <button type="button" class="btn btn-sm variant-filled m-2" on:click={addGaussian}>Add Gaussian</button>
    <GaussianEditor {selectedGaussian} 
    on:update={handleUpdate} />
</div>
<div class="w-2/3"><ColormapDisplay {gaussians} on:updateIndex={handleIndexUpdate} on:update={handleUpdate}/></div>
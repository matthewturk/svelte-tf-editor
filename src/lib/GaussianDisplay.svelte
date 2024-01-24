<script>
	export let gaussians = [
        { width: 50, center: 50, height: 20 }
    ];

	import GaussianEditor from './GaussianEditor.svelte';
    import ColormapDisplay from './ColormapDisplay.svelte';
	let selectedGaussian = gaussians[0];
    let itemIndex = 0;

	function handleUpdate(event) {
        selectedGaussian = event.detail;
        gaussians[itemIndex] = selectedGaussian;
        gaussians = [...gaussians];
    }
    function addGaussian() {
        const newGaussian = {width: 50, center:50, height: 20};
        gaussians = [...gaussians, newGaussian];
        selectedGaussian = newGaussian;
        itemIndex = gaussians.length - 1;
    }
    function selectGaussian(index) {
        selectedGaussian = gaussians[index];
        itemIndex = index;
    }
</script>

<div>
	{#each gaussians as item, index}
		<div class="item" on:click={() => selectGaussian(index)}>
			<div>Width: {item.width}</div>
			<div>Center: {item.center}</div>
			<div>Height: {item.height}</div>
		</div>
	{/each}
    <button on:click={addGaussian}>Add Gaussian</button>
    <GaussianEditor {selectedGaussian} on:update={handleUpdate} />
</div>
<div><ColormapDisplay {gaussians}/></div>

<style>
	.item {
		border: 1px solid black;
		margin-bottom: 10px;
		padding: 10px;
	}
</style>

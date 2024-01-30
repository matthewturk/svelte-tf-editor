<script lang="ts">
	import Scene from './Scene.svelte';

	import { Canvas } from '@threlte/core';
	let colorValue = '#ff0000';
</script>

<div class="w-2/3 p-2 m-2 h-2/3">
	<Canvas>
		<Scene bind:color={colorValue} />
	</Canvas>
</div>
<div class="grid grid-cols-[auto_1fr] gap-2">
	<input class="input" type="color" bind:value={colorValue} />
	<input class="input" type="text" bind:value={colorValue} readonly tabindex="-1" />
</div>

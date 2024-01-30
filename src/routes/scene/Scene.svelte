<script lang="ts">
	import { T } from '@threlte/core';
	import { interactivity, OrbitControls } from '@threlte/extras';
    interactivity();
    export let color = "blue";
    import Grid from './Grid.svelte';
</script>

<T.PerspectiveCamera
	makeDefault
	position={[10, 10, 10]}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
	<OrbitControls />
</T.PerspectiveCamera>

<Grid {color}/>

<!-- <T.Mesh>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.LineBasicMaterial color={color} />
</T.Mesh> -->

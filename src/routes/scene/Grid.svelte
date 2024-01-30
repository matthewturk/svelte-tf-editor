<script lang="ts">
	import { T } from '@threlte/core';
	import { BufferAttribute, LineBasicMaterial, LineSegments, Vector3 } from 'three';
	export let corners = [
		[0, 0, 0],
		[1, 0, 0],
		[1, 1, 0],
		[0, 1, 0],
		[0, 0, 1],
		[1, 0, 1],
		[1, 1, 1],
		[0, 1, 1]
	];

	const positions = new Float32Array(8 * 3);
	const indices = Uint32Array.from([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
	export let color = '#ffffff';

	$: {
		corners.forEach((p, i) => {
			positions[i * 3] = p[0];
			positions[i * 3 + 1] = p[1];
			positions[i * 3 + 2] = p[2];
		});
	}
</script>

<T.LineSegments>
	<T.BufferGeometry>
		<T.BufferAttribute
			args={[positions, 3]}
			attach={(parent, self) => {
				parent.setAttribute('position', self);
				return () => {
					// cleanup function called when ref changes or the component unmounts
					// https://threlte.xyz/docs/reference/core/t#attach
				};
			}}
		/>
		<T.BufferAttribute
			args={[indices, 1]}
			attach={(parent, self) => {
				parent.setIndex(self);
				return () => {
					// cleanup function called when ref changes or the component unmounts
					// https://threlte.xyz/docs/reference/core/t#attach
				};
			}}
		/>
		<T.LineBasicMaterial {color}, linewidth={2} />
	</T.BufferGeometry>
</T.LineSegments>

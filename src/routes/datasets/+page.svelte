<script lang="ts">
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
    import SvelteMarkdown from 'svelte-markdown';

	const girderUrl = 'https://girder.hub.yt/api/v1';

	let collectionData: TableSource;

	async function getCollections() {
		const response = await fetch(`${girderUrl}/collection`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}

	function setTableSource(): TableSource {
		return {
			head: ['Name', 'Created', 'Size'],
			body: tableMapperValues(collections, ['name', 'created', 'size']),
			meta: tableMapperValues(collections, ['_id', 'name', 'created', 'size', 'description']),
			foot: ['Total:', '', `${Object.values(collections).reduce((a, b) => a + b.size, 0)}`]
		};
	}

	let description = '';

	function selectRow(event: CustomEvent<TableMeta>): void {
		description = event.detail[4];
	}

	import { onMount } from 'svelte';

	let collections: GirderCollection[] = [];
	// Replace with your Girder instance URL and file ID

	async function getFileAsTypedArray(fileId: string): Promise<Uint8Array> {
		// Get the file from Girder
		const response = await fetch(`${girderUrl}/file/${fileId}/download`);
		const arrayBuffer = await response.arrayBuffer();

		// Create a Uint8Array from the ArrayBuffer
		const typedArray = new Uint8Array(arrayBuffer);

		return typedArray;
	}

	onMount(async () => {
		try {
			collections = await getCollections();
		} catch (error) {
			console.error(error);
		}
		console.log(collections[0]);
		collectionData = setTableSource();
	});

	import type { GirderCollection } from '$lib/girder';

	// Replace with your Girder instance URL and collection ID
	const collectionId = 'your_collection_id';

	async function getCollectionDetails() {
		// Get the folders in the collection
		const response = await fetch(`${girderUrl}/collection/${collectionId}/details`);
		const collectionDetails: GirderCollection = await response.json();

		// Print the number of folders and size of the collection
		console.log(`Number of folders: ${collectionDetails.nFolders}`);
		console.log(`Size of the collection: ${collectionDetails.size} bytes`);
	}
	let tableSimple: TableSource;

	$: tableSimple = collectionData ? setTableSource() : { body: [], head: [], meta: [], foot: [] };
</script>

<div class="container flex mx-auto p-8 space-y-8 w-full">
	<h1>Collections</h1>
	<div class="w-1/3 p-2 m-1">
		<Table source={tableSimple} interactive on:selected={selectRow} />
	</div>
	<div class="w-2/3 p-2 m-1">
		<SvelteMarkdown source={description} />
	</div>
</div>

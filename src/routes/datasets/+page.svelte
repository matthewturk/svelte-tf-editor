<script lang="ts">
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import SvelteMarkdown from 'svelte-markdown';
	import Time from 'svelte-time';
	import prettyBytes from 'pretty-bytes';
	import { type Readable, writable } from 'svelte/store';
	import { DataHandler, Datatable, Th, ThFilter, type Row, type Field } from '@vincjo/datatables';
	import type { GirderCollection, GirderCollectionDetails } from '$lib/girder';

	const girderUrl = 'https://girder.hub.yt/api/v1';

	let handler: DataHandler;
	let rows: Readable<any[]>;
	let selected = writable<string>('');
	let description = '';
	let detailInfo: GirderCollectionDetails | null;

	async function getCollections() {
		const response = await fetch(`${girderUrl}/collection`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
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
		handler = new DataHandler(collections, { rowsPerPage: 10 });
		rows = handler.getRows();
		console.log($rows);
	});

	// Replace with your Girder instance URL and collection ID
	const collectionId = 'your_collection_id';

	async function getCollectionDetails() {
		// Get the folders in the collection
		const response = await fetch(`${girderUrl}/collection/${collectionId}/details`);
		const collectionDetails: GirderCollectionDetails = await response.json();

		// Print the number of folders and size of the collection
		console.log(`Number of folders: ${collectionDetails.nFolders}`);
		console.log(`Size of the collection: ${collectionDetails.size} bytes`);
	}
</script>

<div class="container flex mx-auto space-y-8 w-full">
	<div class="w-1/2 p-2 m-2 h-full">
		<h1 class="m-2">Collections</h1>
		{#if handler}
			<Datatable {handler}>
				<table class="table table-hover table-compact table-auto w-full">
					<thead>
						<tr>
							<Th {handler} orderBy="name">Name</Th>
							<Th {handler} orderBy="created">Created</Th>
							<Th {handler} orderBy="size">Size</Th>
						</tr>
						<tr>
							<ThFilter {handler} filterBy="name" />
							<ThFilter {handler} filterBy="created" />
							<ThFilter {handler} filterBy="size" />
						</tr>
					</thead>
					<tbody>
						{#each $rows || [] as row}
							<tr
								class:bg-primary-active-token={$selected == row._id}
								on:click={(e) => {
									console.log($selected);
									if ($selected == row._id) {
										$selected = '';
										description = '';
										detailInfo = null;
									} else {
										$selected = row._id;
										description = row.description;
									}
								}}
							>
								<td>{row.name}</td>
								<td><Time relative timestamp={row.created} /></td>
								<td>{prettyBytes(row.size)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Datatable>
		{/if}
	</div>
	<div class="w-1/2 p-2 m-1 h-dvh">
		<div class="w-full p-1 m-1 h-32">
			{#if detailInfo}{/if}
		</div>
		<div class="w-full p-1 m-1 h-3/4 overflow-scroll bg-surface-500">
			<SvelteMarkdown source={description} />
		</div>
	</div>
</div>

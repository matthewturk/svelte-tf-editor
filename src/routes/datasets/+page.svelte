<script lang="ts">
    async function getCollections() {
        const response = await fetch('https://girder.hub.yt/api/v1/collection');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    import { onMount } from 'svelte';

    let collections = [];

    onMount(async () => {
        try {
            collections = await getCollections();
        } catch (error) {
            console.error(error);
        }
    });
</script>

<h1>Collections</h1>

{#each collections as collection}
    <a href="https://girder.hub.yt/#collection/{collection._id}">{collection.name}</a><br/>
{/each}
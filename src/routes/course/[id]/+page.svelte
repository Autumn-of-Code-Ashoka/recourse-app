<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData
</script>


<svelte:head>
    <title>Recourse | {data.name} Details</title>
</svelte:head>

{#await data}
    Loading...
{:then course} 
    {JSON.stringify(course)}
{/await}
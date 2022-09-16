<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData
</script>

{#await data}
    Loading...
{:then course} 
    {JSON.stringify(course)}
{/await}
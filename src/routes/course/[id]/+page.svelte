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
    <div id = "container">
        <h1 class = "text-2xl text-light">{course.name}</h1>
        <h1 class = "text-xl text-end grid">{course.semester}</h1>
        <div class = "col-span-2 my-4" id = "course-details-html">
            {@html course.html_details}
        </div>
    </div>
{/await}

<style>
    #container
    {
        display: grid;
        grid-template-columns: 3fr 1fr;
        align-items: baseline;
    }

    :global(#course-details-html div)
    {
        margin-bottom: 1.2rem;
    }

    :global(#course-details-html div *)
    {
        color: theme("colors.text") !important;
        background-color: #00000000 !important;
        font-family: theme("fontFamily.maven") !important;
        font-size: 1rem !important;
    }

    :global(#course-details-html a)
    {
        color: theme("colors.light") !important;
    }

    :global(#course-details-html a:hover)
    {
        text-decoration: underline;
    }
</style>
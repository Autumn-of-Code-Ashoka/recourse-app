<script lang="ts">
    import { goto } from "$app/navigation";
    import { sidebarState } from "$lib/stores";
    import LoadingAnimation from "../../LoadingAnimation.svelte";
	import type { PageData } from "./$types";
    import ProfReviews from "./ProfReviews.svelte";
    import ProfSidebar from "./ProfSidebar.svelte";
    
    export let data: PageData;

    function BrowseDept()
    {
        const index = $sidebarState.fields.profs.findIndex(field => field.name === "department");

        if (index !== -1)
        {
            $sidebarState.fields.profs[index].selected = true;
            $sidebarState.fields.profs[index].value = data.department;
            goto("/prof");
        }
    }

    sidebarState.openComponent(ProfSidebar, { "prof": data });
</script>


<svelte:head>
    <title>Recourse | {data.name} Details</title>
</svelte:head>

{#await data}
    <LoadingAnimation />
{:then prof} 
    <div id = "container" class = "mb-10 relative">
        <h1 class = "text-2xl text-light">{prof.name}</h1>
        <button on:click = {BrowseDept}><h1 class = "text-xl text-end grid">{prof.department}</h1></button>
        {#if prof?.html_details?.trim()}
            <div class = "col-span-2 my-4" id = "prof-position">
                {prof?.html_details}
            </div>
        {:else}
            <div class = "col-span-2 my-4">Prof descriptions coming soon!</div>
        {/if}
    </div>
    <ProfReviews class = "bg-secondary relative px-4 right-6 bottom-0 rounded-t-xl" />
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

    :global(#course-details-html table)
    {
        width: 100% !important;
        margin-top: 4px;
        margin-left: 0;
        margin-right: 0;
    }

    :global(#course-details-html td)
    {
        border-color: theme("colors.text") !important;
    }
</style>
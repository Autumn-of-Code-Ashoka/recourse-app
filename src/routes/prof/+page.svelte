<script lang="ts">
    import { profs, currentPageStore, sidebarState } from "$lib/stores";
    import { itemsPerPage } from "$lib/stores";
	import { onMount } from "svelte";
    import type { ProfViewResponse, Faculty } from "$lib/types";
    import PaginatedView from "../LayoutComponents/PaginatedView.svelte";
    import ProfCard from "./ProfCard.svelte";
    import LoadingAnimation from "../LoadingAnimation.svelte";

    $: {
        const departments = new Array(...new Set($profs.map(prof => prof.department))).map(dept => ({value: dept, label: dept}));
        
        sidebarState.open("profs", $sidebarState.fields.profs.map(field => {
            switch(field.name)
            {
                case "department":
                    return {...field, options: departments};
                break;
            }

            return field;
        }));
    };
    
    $: filters = ($sidebarState.fields.profs ?? []).filter(field => field.selected);
    $: filteredProfs = $profs.filter(prof => filters.every(filter => {
        if (filter.type === "text")
        {
            const baseName = filter.name as keyof Omit<ProfViewResponse["data"][0], "courses_offered" | "ratings" | "_v" | "reviews">;
            const value = (filter.value as string).toLowerCase();

            switch (filter.name)
            {

                default:
                    return prof[baseName].toLowerCase().includes(value);
                break;
            }
        }
        else
        {
            const value = filter.value as [number, number];
            const baseName = filter.name as keyof ProfViewResponse["data"][0]["ratings"];

            return prof.ratings[baseName] >= value[0] && prof.ratings[baseName] <= value[1];
        }
    }));
    
    $: pageProfs = filteredProfs.slice();
    onMount(() => {
        return () => sidebarState.close();
    });
</script>

<svelte:head>
    <title>Recourse | Professors</title>
</svelte:head>

<div class = "mb-8 grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6">
    {#if $profs.length === 0}
        <LoadingAnimation />
    {:else} 
        <PaginatedView elements = {pageProfs} bind:page = {$currentPageStore.profs} component = {ProfCard} perPage = {itemsPerPage}/>
    {/if}
</div>
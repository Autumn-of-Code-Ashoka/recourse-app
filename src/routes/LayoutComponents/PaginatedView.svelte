<script lang="ts">
    import type { SvelteComponent } from "svelte";
    import { fly } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { cubicInOut } from "svelte/easing";

    export let elements: any[];
    export let page: number;
    export let perPage: number;
    export let component: typeof SvelteComponent;

    $: pageCount = Math.ceil(elements.length / perPage);
    $: pageElements = elements.slice(page * perPage, (page + 1) * perPage);
</script>

<div class = "md:col-span-3 2xl:col-span-4 justify-center flex gap-2 flex-wrap">
    {#each new Array(pageCount) as _, i (i)}
        <button class = "px-4 py-2 rounded-xl bg-secondary hover:bg-indigo-700 transition-colors" class:bg-indigo-700 = {page === i} on:click = {() => page = i}
            transition:fly|local = {{duration: 200, easing: cubicInOut, y: -100}} animate:flip = {{duration: 400, easing: cubicInOut}}>
            {i + 1}
        </button>
    {/each}
</div>
{#each pageElements as element (element._id)}
    <svelte:component this = {component} item = {element}/>
{/each}
<div class = "md:col-span-3 2xl:col-span-4 justify-center flex gap-2 flex-wrap">
    {#each new Array(pageCount) as _, i (i)}
        <button class = "px-4 py-2 rounded-xl bg-secondary hover:bg-indigo-700 transition-colors" class:bg-indigo-700 = {page === i} on:click = {() => page = i}
            transition:fly|local = {{duration: 200, easing: cubicInOut, y: -100}} animate:flip = {{duration: 400, easing: cubicInOut}}>
            {i + 1}
        </button>
    {/each}
</div>
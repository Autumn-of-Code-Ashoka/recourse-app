<script lang="ts">
    import { sidebarState } from "$lib/stores";
    import { fly } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { cubicInOut } from "svelte/easing";
    import IoMdRemoveCircle from 'svelte-icons/io/IoMdRemoveCircle.svelte'

    let width: number;
    let height: number;

    $: selectedFields = $sidebarState.fields.map((field, i) => ({...field, i})).filter(field => field.selected);
    $: unselectedFields = $sidebarState.fields.map((field, i) => ({...field, i})).filter(field => !field.selected);
</script>

<div bind:clientWidth = {width} class = "xl:h-[36rem]" />
<aside class = "bg-secondary xl:h-[36rem] rounded-2xl pl-8 pr-2 py-4 xl:fixed" style:width = {`${width}px`} bind:offsetHeight = {height} class:active = {$sidebarState.open}
    style = {`--height: -${height}px`}>
    <h1 class = "text-2xl mb-4 text-light">Filters</h1>
    <form on:submit|preventDefault>
        <div class = "w-full flex flex-row flex-wrap gap-x-2 gap-y-1 mb-4 select-none">
            {#each unselectedFields as field (field.name)}
                <button class = "px-3 py-1 rounded-xl text-light bg-background" on:click= {() => {sidebarState.toggle(field.i)}} animate:flip = {{duration: 300, easing: cubicInOut}}>
                    { field.label }
                </button>
            {/each}
        </div>
        <div class = "">
            {#each selectedFields as field (field.name)}
                <div class = "mb-4 w-full grid gap-2 place-content-between field" animate:flip = {{duration: 300, easing: cubicInOut}} 
                transition:fly = {{x: -100,duration: 300, easing: cubicInOut}}>
                    <label for = {field.name} class = "">{ field.label }:</label>
                    {#if field.type == "text"}
                        <input name = {field.name} size = {3} type = "text" bind:value = {$sidebarState.fields[field.i].value} list = {field.options ? field.name : undefined} />
                    {:else}
                        <div>
                            <input name = {field.name} size = {3} type = "number" bind:value = {$sidebarState.fields[field.i].value[0]} 
                            min = {field.range?.at(0) ?? 0} max = {field.value[1]} />
                            to
                            <input name = {field.name} size = {3} type = "number" bind:value = {$sidebarState.fields[field.i].value[1]} 
                            min = {field.value[0]} max = {field.range?.at(1) ?? 5} step = {field.step ?? 1}/>
                        </div>
                    {/if}
                    {#if field.options !== undefined}
                        <datalist id = {field.name}>
                            {#each field.options as option}
                                <option value = {option.label} />
                            {/each}
                        </datalist>
                    {/if}
                    <div class = "flex justify-end pr-4">
                        <div class = "w-7 cursor-pointer text-red-200 hover:scale-125 transition-transform" on:click = {(e) => {sidebarState.toggle(field.i); e.currentTarget.setAttribute("disabled", true)}}>
                            <IoMdRemoveCircle />
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </form>
</aside>

<style>
    aside 
    {
        transition-duration: 0.3s;
        transition-timing-function: ease-in-out;
        margin-bottom: var(--height);
        transform: translateX(-125%) scaleY(0);
        opacity: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    aside.active
    {
        transform: translateX(0) scaleY(1);
        margin-bottom: 10px;
        opacity: 1;
    }

    .field
    {
        grid-template-columns: 1fr 2fr 1fr;
        align-items: center;
    }

    input::-webkit-outer-spin-button,input::-webkit-inner-spin-button
    {
        margin-left: 6px;
    }

    input::-webkit-calendar-picker-indicator
    {
        position: relative;
        bottom: 3px;
        margin-left: 4px;
    }

    input
    {
        background-color: theme("colors.background");
        border-radius: 12px;
        text-align: right;
        padding: 2px 4px;
        margin: 2px 0;
        border: solid 2px theme("colors.background");
        transition: border-color 0.3s;
    }
    
    input[type="number"]
    {
        width: 50%;
    }

    input:focus
    {
        outline: none;
        border: solid 2px theme("colors.accent-light");
    }
</style>
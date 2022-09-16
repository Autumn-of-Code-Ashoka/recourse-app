<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
    import "../app.css";
    
    import Header from "./Header.svelte";
</script>

<Header />
<div id = "layout-grid" class = "py-4 px-8 h-full">
    <div>
        <slot name = "left" />
    </div>
    <div>
        <slot />
    </div>
</div>

<style>
    #layout-grid 
    {
        display: grid;
        grid-template-columns: 1fr 2.5fr 1fr;
        column-gap: 18px;
    }
</style>
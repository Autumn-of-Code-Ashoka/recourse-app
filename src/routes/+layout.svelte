<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
    import "../app.css";
    
    import Header from "./Header.svelte";

    let loading = false;

    beforeNavigate(_ => {
        loading = true;
    })

    afterNavigate(_ => {
        loading = false;
    })
</script>

<Header />
<div class = "mx-auto md:w-2/3 w-[95%]">
    {#if loading}
        Loading content...
    {:else}
        <slot />
    {/if}
</div>
<script lang="ts">
    import { page } from "$app/stores";

    export let href: string;

    $: active = $page.url.pathname.includes(href);
</script>

<span class = "mx-4 text-xl text-light relative" class:active>
    <a {href} data-sveltekit-prefetch><slot /></a>
</span>

<style>
    span ::after 
    {
        content: "";
        position:absolute;
        width: 0;
        height: 4px;
        left: 50%;
        bottom: -4px;
        border-radius: 8px;
        background-color: theme("colors.accent-light");
        opacity: 0;
        transition: all 0.2s ease-in-out;
    }

    span.active ::after, span:hover ::after
    {
        width: 110%;
        height: 4px;
        left: -5%;
        bottom: -12px;
        opacity: 1;
    }
</style>
<script lang="ts">
    export let href: string;
</script>

<span class = "mx-4 text-xl">
    <a {href} data-sveltekit-prefetch><slot /></a>
</span>

<style>

</style>
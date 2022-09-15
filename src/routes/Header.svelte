<script lang="ts">
    import Link from "./HeaderLink.svelte";

    let height: number;
</script>

<header class = "bg-background w-full border-b-2 border-b-secondary fixed" bind:offsetHeight={height}>
    <div class = "flex flex-col justify-center items-center h-full py-6">
        <a href = "/"><h1 class = "text-4xl font-mono font-medium"><span class = "text-accent-light">re</span>Course</h1></a>
        <nav class = "my-4 flex-row justify-center items-center">
            <Link href = "/course">Course</Link>
            <Link href = "/professor">Professor</Link>
            <Link href = "/review">Review</Link>
        </nav>
    </div>
</header>
<div style:height = {`${height}px`} class = "mb-3"></div>

<style>

</style>
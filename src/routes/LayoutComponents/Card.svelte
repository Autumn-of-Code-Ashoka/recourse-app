<script lang="ts">
    export let href: string;
</script>

<a href = {href} class = "card bg-secondary rounded-2xl px-4 pt-4 pb-8 block">
    <div class = "">
        <slot name = "title" />
    </div>
    <div class = "text-end">
        <slot name = "title-right" />
    </div>
    <div class = "col-span-2">
        <slot name = "subtitle" />
    </div>
    <div class = "col-span-2 w-full">
        <slot name = "content" />
    </div>
</a>


<style>
    .card
    {
        display: grid;
        grid-template-columns: 2fr 1fr;
        align-items: start;
    }
</style>
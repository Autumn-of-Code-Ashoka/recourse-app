<script lang="ts">
    import Card from "../LayoutComponents/Card.svelte";
    import type { CourseViewResponse, Faculty } from "$lib/types";
    import { CreatePeopleString } from "$lib/types";

    export let item: CourseViewResponse["data"][0];
</script>

<Card href = {`course/${item._id}`}>
    <h1 slot = "title" class = "text-sm mb-2 text-light">{item.name}<br>({item.code.map(code => code.slice(1, -1)).join("/")})</h1>
    <h1 slot = "title-right" class = "text-sm">{item.semester}</h1>
    <div slot = "subtitle" class = "mb-1">
        <p class = "text-sm">{`By ${CreatePeopleString(item.faculty.professors)}`}</p>
        {#if item.faculty.TFs.length > 0}
            <p class = "text-sm">{`With ${CreatePeopleString(item.faculty.TFs)}`}</p>
        {/if}
    </div>
    <div slot = "content" class = "text-sm grid grid-cols-2 mt-2">
        <div>
            Review Count:
        </div>
        <div class = "text-end">
            {item.ratings.sample_size}
        </div>
        <div>
            Overall Score:
        </div>
        <div class = "text-end">
            {item.ratings.compound_score.toPrecision(3)} / 5.0
        </div>
    </div>
</Card>
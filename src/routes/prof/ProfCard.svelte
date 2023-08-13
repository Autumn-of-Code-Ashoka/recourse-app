<script lang="ts">
    import Card from "../LayoutComponents/Card.svelte";
    import type { ProfViewResponse, Faculty } from "$lib/types";
    import { CreatePeopleString } from "$lib/types";

    export let item: ProfViewResponse["data"][0];
</script>

<Card href = {`prof/${item._id}`}>
    <h1 slot = "title" class = "text-sm mb-2 text-light">{item.name}</h1>
    <h2 slot = "subtitle" class = "text-sm">{item.position.replace(", Ashoka University", "").trim()}</h2>
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
            {item.ratings.holistic.toPrecision(3)} / 5.0
        </div>
    </div>
</Card>
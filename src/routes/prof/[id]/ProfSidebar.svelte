<script lang="ts">
    import { goto } from "$app/navigation";
    import { sidebarState } from "$lib/stores";
    import type { ProfViewResponse, RatingAggregate } from "$lib/types";
    import IoIosAttach from 'svelte-icons/io/IoIosAttach.svelte'

    export let prof: ProfViewResponse["data"][0];
    
    function Capitalise(s: string)
    {
        const words = s.split(" ");
        const capitalisedWords = words.map(word => word[0].toUpperCase() + word.slice(1));
        return capitalisedWords.join(" ");
    }

    function BrowseCourse(course_name: string)
    {
        const index = $sidebarState.fields.courses.findIndex(field => field.name === "name");
        if (index !== -1)
        {
            $sidebarState.fields.courses[index].selected = true;
            $sidebarState.fields.courses[index].value = course_name;
            goto("/course");
        }
    }

    function BrowseDept()
    {
        const index = $sidebarState.fields.profs.findIndex(field => field.name === "department");
        if (index !== -1)
        {
            $sidebarState.fields.profs[index].selected = true;
            $sidebarState.fields.profs[index].value = prof.department;
            goto("/prof");
        }
    }
</script>

<div class = "pr-5">
    <div class = "flex flex-row justify-between items-baseline">
        <button on:click = {BrowseDept} class = "text-start"><h1 class = "text-2xl text-light">{prof.department ?? "Unknown"} Department</h1></button>
        <h1 class = "text-xl text-end">{prof.courses_offered.join(", ")}</h1>
    </div>
    <div class = "mt-4">
        <div class = "mb-4">
            Offers
            {#each prof.courses_offered as course}
                <button on:click = {() => BrowseCourse(course)} class = "text-light no-underline hover:underline">{course}</button>
                
                <!-- <div>            
                    {#if course.faculty.TFs.length > 0}
                    With TAs: <span class = "text-light">{course.faculty.TFs.map(tf => tf.name).join(", ")}</span>
                    {/if}
                </div>
                
                Review Count: <span class = "text-light">{course.ratings.sample_size}</span> -->
            {/each}
        </div> 
        <div class = "grid grid-cols-2">
            <h2 class = "text-2xl text-light col-span-2 mb-2">Ratings</h2>
            <!-- TODO: Convert this to a star system with a mask -->
            {#each Object.keys(prof.ratings).slice(1) as rating}
                <div class = "text-md">{Capitalise(rating.replaceAll("_", " "))}</div>
                <div class = "text-md text-end text-light">{prof.ratings[rating].toPrecision(3)} / 5</div>
            {/each}
        </div>
    </div>
</div>
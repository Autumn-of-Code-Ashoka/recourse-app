<script lang="ts">
    import { goto } from "$app/navigation";
    import { sidebarState } from "$lib/stores";
    import type { CourseViewResponse, Faculty } from "$lib/types";
    import IoIosAttach from 'svelte-icons/io/IoIosAttach.svelte'

    export let course: CourseViewResponse["data"][0];
    
    function Capitalise(s: string)
    {
        const words = s.split(" ");
        const capitalisedWords = words.map(word => word[0].toUpperCase() + word.slice(1));
        return capitalisedWords.join(" ");
    }

    function SplitProfs() : [string, boolean][]
    {
        const count = course.faculty.professors.length;
        return course.faculty.professors.map((prof, i) => [prof.name, i == count - 1]);
    }

    function BrowseProf(prof: string)
    {
        const index = $sidebarState.fields.courses.findIndex(field => field.name === "faculty");
        
        // TODO: This should probably go to the faculty view instead of the course view
        
        if (index !== -1)
        {
            $sidebarState.fields.courses[index].selected = true;
            $sidebarState.fields.courses[index].value = prof;
            goto("/course");
        }
    }

    function BrowseDept()
    {
        const index = $sidebarState.fields.courses.findIndex(field => field.name === "department");
        if (index !== -1)
        {
            $sidebarState.fields.courses[index].selected = true;
            $sidebarState.fields.courses[index].value = course.department;
            goto("/course");
        }
    }
</script>

<div class = "pr-5">
    <div class = "flex flex-row justify-between items-baseline">
        <button on:click = {BrowseDept}><h1 class = "text-2xl text-light">{course.department ?? "Unknown"} Department</h1></button>
        <h1 class = "text-xl text-end">{course.code.join(", ")}</h1>
    </div>
    <div class = "mt-4">
        {#if course.document !== ""}
            <a class = "flex flex-row items-middle text-xl gap-2 w-auto mb-4" href = {course.document} target = "__blank">
                <div class = "w-6 pt-[2px]"><IoIosAttach /></div>
                Course Document
            </a>
        {/if}
        <div class = "mb-4">
            Offered by 
            {#each SplitProfs() as prof}
                <button on:click = {() => BrowseProf(prof[0])} class = "text-light no-underline hover:underline">{prof[0]}{prof[1] ? "" : ", "}</button>
            {/each}
            
            {#if course.faculty.TFs.length > 0}
                <div>
                    With TAs: <span class = "text-light">{course.faculty.TFs.map(tf => tf.name).join(", ")}</span>
                </div>
            {/if}

            Review Count: <span class = "text-light">{course.ratings.sample_size}</span>
        </div> 
        <div class = "grid grid-cols-2">
            <h2 class = "text-2xl text-light col-span-2">Ratings</h2>
            <!-- TODO: Convert this to a star system with a mask -->
            {#each Object.keys(course.ratings).slice(1) as rating}
                <div class = "text-lg">{Capitalise(rating.replaceAll("_", " "))}</div>
                <div class = "text-lg text-end text-light">{course.ratings[rating].toPrecision(3)}</div>
            {/each}
        </div>
    </div>
</div>
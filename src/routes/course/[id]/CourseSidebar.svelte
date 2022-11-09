<script lang="ts">
    import { goto } from "$app/navigation";
    import { sidebarState } from "$lib/stores";
    import type { CourseViewResponse } from "$lib/types";

    export let course: CourseViewResponse["data"][0];

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
</div>
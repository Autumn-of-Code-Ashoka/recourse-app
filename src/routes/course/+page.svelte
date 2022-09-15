<script lang="ts">
    import { courses } from "$lib/stores";
	import { goto } from "$app/navigation";

</script>

{#each $courses as course (course._id)}
<div class = "my-8 cursor-pointer" on:click = {() => goto(`course/${course._id}`)}>
    <h1>{course.name}</h1>
    <div>
        {#each course.faculty.professors as professor (professor._id)}
            <p>{professor.name}</p>
        {/each}
    </div>
    <p>{course.code.map(code => code.slice(1, -1)).join("/")}</p>
</div>
{/each}
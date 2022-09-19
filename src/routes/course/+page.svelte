<script lang="ts">
    import { courses, sidebarState } from "$lib/stores";
    import { fly } from "svelte/transition"
    import { flip } from "svelte/animate";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";

    $: {
        const semesters = new Array(...new Set($courses.map(course => course.semester))).map(sem => ({value: sem, label: sem}));
        const codes = new Array(...new Set($courses.map(course => course.code[0]))).map(code => ({value: code, label: code}));
        const departments = new Array(...new Set($courses.map(course => course.department))).map(dept => ({value: dept, label: dept}));

        sidebarState.open([
            {name: "code", label: "Code", type: "text", selected: false, value: "", options: codes},
            {name: "name", label: "Name", type: "text", selected: false, value: ""},
            {name: "faculty", label: "Faculty", type: "text", selected: false, value: ""},
            {name: "semester", label: "Semester", type: "text", selected: false, value: "", options: semesters},
            {name: "department", label: "Department", type: "text", selected: false, value: "", options: departments},
            {name: "sample_size", label: "Review Count", type: "number", selected: false, value: [1, 1000], range: [0, 1000]},
            {name: "engaging", label: "Engaging Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "interesting_material", label: "Material Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "grading", label: "Grading Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "workload", label: "Workload Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "attendance", label: "Attendance Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "TFs", label: "TA/TF Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "holistic", label: "Holistic Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
            {name: "compound_score", label: "Compound Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        ]);
    };

    $: filters = $sidebarState.fields.filter(field => field.selected);
    $: filteredCourses = $courses.filter(course => filters.every(filter => {
        if (filter.type === "text")
        {
            const value = (filter.value as string).toLowerCase();

            switch (filter.name)
            {
                case "faculty":
                    const all = [...course.faculty.TFs, ...course.faculty.professors];
                    return all.some(faculty => faculty.name.toLowerCase().includes(value));
                break;

                case "code":
                    const code = course.code.join("/").toLowerCase();
                    return code.includes(value);
                break;

                default:
                    return course[filter.name].toLowerCase().includes(value);
                break;
            }
        }
        else
        {
            const value = filter.value as [number, number];

            return course.ratings[filter.name] >= value[0] && course.ratings[filter.name] <= value[1];
        }
    }));


    onMount(() => {
        return () => sidebarState.close();
    });
</script>

<svelte:head>
    <title>Recourse | Courses</title>
</svelte:head>

{#if $courses.length === 0}
    Loading data...
{:else} 
    {#each filteredCourses as course (course._id)}
    <div class = "mb-8 cursor-pointer" on:click = {() => goto(`course/${course._id}`)}>
        <h1>{course.name}</h1>
        <div>
            {#each course.faculty.professors as professor (professor._id)}
                <p>{professor.name}</p>
            {/each}
        </div>
        <p>{course.code.map(code => code.slice(1, -1)).join("/")}</p>
    </div>
    {/each}
{/if}
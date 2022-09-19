<script lang="ts">
    import { courses, sidebarState } from "$lib/stores";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import type { CourseViewResponse, Faculty } from "$lib/types";
    import Card from "../LayoutComponents/Card.svelte";

    function CreatePeopleString(people: Faculty[], trunc = 2)
    {
        if (people.length === 1) return people[0].name;
        if (people.length === 0) return "Unknown";

        const names = people.map(person => person.name);
        const truncated = names.length > trunc;
        return truncated ? `${names.slice(0, trunc).join(", ")}, and others...` : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
    }

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
            const baseName = filter.name as keyof Omit<CourseViewResponse["data"][0], "faculty" | "code" | "ratings" | "_v" | "reviews">;
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
                    return course[baseName].toLowerCase().includes(value);
                break;
            }
        }
        else
        {
            const value = filter.value as [number, number];
            const baseName = filter.name as keyof CourseViewResponse["data"][0]["ratings"];

            return course.ratings[baseName] >= value[0] && course.ratings[baseName] <= value[1];
        }
    }));


    onMount(() => {
        return () => sidebarState.close();
    });
</script>

<svelte:head>
    <title>Recourse | Courses</title>
</svelte:head>

<div class = "mb-8 cursor-pointer grid grid-cols-1 md:grid-cols-3 gap-6">
{#if $courses.length === 0}
Loading data...
{:else} 
    {#each filteredCourses as course (course._id)}
        <Card href = {`course/${course._id}`}>
            <h1 slot = "title" class = "text-sm mb-2">{course.name}<br>({course.code.map(code => code.slice(1, -1)).join("/")})</h1>
            <h1 slot = "title-right" class = "text-sm">{course.semester}</h1>
            <div slot = "subtitle" class = "mb-1">
                <p class = "text-sm">{`By ${CreatePeopleString(course.faculty.professors)}`}</p>
                {#if course.faculty.TFs.length > 0}
                    <p class = "text-sm">{`With ${CreatePeopleString(course.faculty.TFs)}`}</p>
                {/if}
            </div>
            <p slot = "content" class = "text-sm">
                Review Count: {course.ratings.sample_size}<br>
                Overall Score: {course.ratings.compound_score.toPrecision(3)} / 5.0
            </p>
        </Card>
    {/each}
{/if}
</div>
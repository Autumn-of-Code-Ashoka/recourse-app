<script lang="ts">
    import { courses, currentPageStore, sidebarState } from "$lib/stores";
    import { itemsPerPage } from "$lib/stores";
	import { onMount } from "svelte";
    import type { CourseViewResponse, Faculty } from "$lib/types";
    import PaginatedView from "../LayoutComponents/PaginatedView.svelte";
    import CourseCard from "./CourseCard.svelte";
    import LoadingAnimation from "../LoadingAnimation.svelte";

    $: {
        const semesters = new Array(...new Set($courses.map(course => course.semester))).map(sem => ({value: sem, label: sem}));
        const codes = new Array(...new Set($courses.map(course => course.code[0]))).map(code => ({value: code, label: code}));
        const departments = new Array(...new Set($courses.map(course => course.department))).map(dept => ({value: dept, label: dept}));

        sidebarState.open("courses", [
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
    
    $: filters = ($sidebarState.fields.courses ?? []).filter(field => field.selected);
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
    
    $: pageCourses = filteredCourses.slice();
    onMount(() => {
        return () => sidebarState.close();
    });
</script>

<svelte:head>
    <title>Recourse | Courses</title>
</svelte:head>

<div class = "mb-8 grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6">
    <!-- {#if $courses.length === 0}
        <LoadingAnimation />
    {:else} 
        <PaginatedView elements = {pageCourses} bind:page = {$currentPageStore.courses} component = {CourseCard} perPage = {itemsPerPage}/>
    {/if} -->
    <LoadingAnimation />
</div>
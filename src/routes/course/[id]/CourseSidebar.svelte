<script lang="ts">
    import type { CourseViewResponse } from "$lib/types";


    export let course: CourseViewResponse["data"][0];
</script>

<h1 class = "text-xl text-light">Offered by {course?.department ?? "Unknown"} Department</h1>
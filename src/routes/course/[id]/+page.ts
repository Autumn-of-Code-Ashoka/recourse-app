import { courses } from "$lib/stores";
import type { CourseViewResponse } from "$lib/types";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({params, fetch}) =>
{
    let cacheMiss = false;

    if (get(courses).length !== 0)
    {
        const element = get(courses).find(course => course._id === params.id);
        if (element) return element;
        cacheMiss = true;
        console.error(`Missed course cache while accessing course ${params.id}`);
    }

    const query = `${import.meta.env.VITE_API_URL}course?${new URLSearchParams({id: params.id})}`;
    const response: CourseViewResponse = await (await fetch(query).catch((err) => {console.error(err); throw error(404, "Course not found");})).json()
    .catch(err => {console.error(err); throw error(404, "Course not found")});

    if (cacheMiss) courses.update(c => [...c, response.data[0]]);

    if (response.data.length !== 1) throw error(404, "Course not found");

    return response.data[0];
};
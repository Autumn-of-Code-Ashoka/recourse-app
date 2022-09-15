import type { CourseViewResponse } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({params}) =>
{
    const query = `${import.meta.env.VITE_API_URL}course?${new URLSearchParams({id: params.id})}`;
    const response: CourseViewResponse = await (await fetch(query).catch((err) => {console.error(err); throw error(404, "Course not found");})).json()
    .catch(err => {console.error(err); throw error(404, "Course not found")});

    if (response.data.length !== 1) throw error(404, "Course not found");

    return response.data[0];
};
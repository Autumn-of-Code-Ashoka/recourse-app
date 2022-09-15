import { courses } from "$lib/stores";
import type { CourseViewResponse } from "$lib/types";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch}) => 
{
    if (get(courses).length !== 0) return {};

    const data = await (
        await fetch(`${import.meta.env.VITE_API_URL}course`)
        .catch(err => {console.error(err); throw err})
    ).json().catch(err => {console.error(err); throw err}) as CourseViewResponse;

    courses.set(data.data);

    return {};
};
import { courses } from "$lib/stores";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch}) => 
{
    if (!courses.pullAllCompleted) courses.pullAll(fetch).catch(err => console.error(err));
    return;
};
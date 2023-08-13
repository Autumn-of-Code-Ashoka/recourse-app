import { profs } from "$lib/stores";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch}) => 
{
    if (!profs.pullAllCompleted) profs.pullAll(fetch).catch(err => console.error(err));
    return;
};
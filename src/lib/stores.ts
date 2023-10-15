import type { SvelteComponent } from "svelte";
import { get, writable } from "svelte/store";
import type { ViewResponse, CourseViewResponse, ProfViewResponse, ReviewViewResponse } from "./types";

/**
 * Generates the stores which cache/store/request data from the api's views. Look at usage below for better understanding.
 * @param endpoint Which endpoint the store should be generated for ("course", "prof", or "review")
 * @returns 
 */
function generate_datastore<T extends ViewResponse>(endpoint: string) {
    const _store = writable<T["data"]>([]);
    let name = endpoint.slice(0, 1).toUpperCase() + endpoint.slice(1, -1);

    return {
        subscribe: _store.subscribe,
        set: _store.set,
        update: _store.update,
        pullAllCompleted: false,
        async pullAll(fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)
        {
            const resp = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`).catch(err => {
                console.log(err);
                throw err;
            });
            const data = await resp.json().catch(err => {console.error(err); throw err}) as T;
            this.set(data.data.sort((a, b) => b.ratings.compound_score - a.ratings.compound_score));
            this.pullAllCompleted = true;
        },
        async pullOne(fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>, id: string)
        {
            if (!/^[0-9a-fA-F]{24}$/.test(id))
            {
                throw new Error(`${name} not found`);
            }

            const cacheSearch = get(this).find(item => item._id === id);

            if (cacheSearch) return cacheSearch;
            
            const query = `${import.meta.env.VITE_API_URL}${endpoint}?${new URLSearchParams({id})}`;
            const resp = await fetch(query).catch(err => {console.error(err); throw err});
            const data = await resp.json().catch(err => {console.error(err); throw err}) as T;

            if (data.data.length !== 1) throw new Error(`${name} not found`);
            this.update(c => [...c, data.data[0]]);
            return data.data[0];
        }
    }
}

export const [courses, profs, reviews] = [generate_datastore<CourseViewResponse>("course"), generate_datastore<ProfViewResponse>("prof"), 
    generate_datastore<ReviewViewResponse>("review")];

type QueryPages = "courses" | "profs" | "reviews";

/**
 * Sets up the default values for each of the sidebar filter fields on each of the views
 */
const defaultFields: {[key in QueryPages]: SidebarFields} = {
    courses: [
        {name: "code", label: "Course Code", type: "text", selected: false, value: "", options: []},
        {name: "name", label: "Course Name", type: "text", selected: false, value: ""},
        {name: "faculty", label: "Faculty", type: "text", selected: false, value: ""},
        {name: "semester", label: "Semester", type: "text", selected: false, value: "", options: []},
        {name: "department", label: "Department", type: "text", selected: false, value: "", options: []},
        {name: "sample_size", label: "Review Count", type: "number", selected: false, value: [1, 100], range: [0, 100]},
        {name: "engaging", label: "Engaging Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "interesting_material", label: "Material Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "grading", label: "Grading Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "workload", label: "Workload Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "attendance", label: "Attendance Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "TFs", label: "TA/TF Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "holistic", label: "Holistic Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "compound_score", label: "Compound Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
    ],
    profs: [
        {name: "name", label: "Name", type: "text", selected: false, value: ""},
        {name: "position", label: "Position", type: "text", selected: false, value: ""},
        {name: "qualification", label: "Qualification", type: "text", selected: false, value: ""},
        {name: "department", label: "Department", type: "text", selected: false, value: "", options: []},
        {name: "sample_size", label: "Review Count", type: "number", selected: false, value: [1, 100], range: [0, 100]},
        {name: "engaging", label: "Engaging Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "interesting_material", label: "Material Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "grading", label: "Grading Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "workload", label: "Workload Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "attendance", label: "Attendance Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "TFs", label: "TA/TF Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "holistic", label: "Holistic Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "compound_score", label: "Compound Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
    ],
    reviews: [
        {name: "review", label: "Text", type: "text", selected: false, value: ""},
        {name: "code", label: "Course Code", type: "text", selected: false, value: "", options: []},
        {name: "semester", label: "Semester", type: "text", selected: false, value: "", options: []},
        {name: "engaging", label: "Engaging Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "interesting_material", label: "Material Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "grading", label: "Grading Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "workload", label: "Workload Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "attendance", label: "Attendance Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "TFs", label: "TA/TF Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "holistic", label: "Holistic Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "compound_score", label: "Compound Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},],
}

type SidebarFields = {
    name: string,
    type: "text" | "number",
    label: string,
    value: string | [number, number],
    range?: [number, number],
    step?: number,
    options?: {value: string, label: string}[],
    selected: boolean
}[];

/**
 * Store which manages the current state of the sidebar, from it being open, displaying the filters window (or some arbitrary component), to 
 * remembering the values of each field/filter per view.
 */
export const sidebarState = (() => {
    const _store = writable<{open: boolean, page: QueryPages, component?: typeof SvelteComponent, props?: any, fields: {[key in QueryPages]: SidebarFields}}>({
        open: false,
        page: "profs",
        fields: defaultFields,
    });

    return {
        subscribe: _store.subscribe,
        set: _store.set,
        open(page: QueryPages, fields: SidebarFields) 
        {
            const current = get(this).fields;
            _store.set({open: true, page, fields: {...current, [page]: fields}, component: undefined, props: undefined});
        },
        openComponent(component: typeof SvelteComponent, props: any)
        {
            _store.update(s => ({...s, open: true, component, props}));
        },
        close()
        {
            _store.update(s => ({...s, open: false, component: undefined, props: undefined}));
        },
        toggle(page: QueryPages, ind: number)
        {
            _store.update(s => {
                const fields = s.fields[page];
                fields[ind].selected = !fields[ind].selected;
                return {...s, fields: {...s.fields, page: fields}};
            });
        }
    }
})();

// Used for pagination (not on the api-side, purely frontend):

type CurrentPage = {courses: number, profs: number, reviews: number}

export const currentPageStore = writable<CurrentPage>({courses: 0, profs: 0, reviews: 0});
export const itemsPerPage = 84;
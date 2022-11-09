import type { SvelteComponent } from "svelte";
import { get, writable } from "svelte/store";
import type { CourseViewResponse } from "./types";

export const courses = (() => 
{
    const _store = writable<CourseViewResponse["data"]>([]);
    
    return {
        subscribe: _store.subscribe,
        set: _store.set,
        update: _store.update,
        pullAllCompleted: false,
        async pullAll(fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>)
        {
            const resp = await fetch(`${import.meta.env.VITE_API_URL}course`).catch(err => {
                console.log(err);
                throw err;
            });
            const data = await resp.json().catch(err => {console.error(err); throw err}) as CourseViewResponse;
            this.set(data.data.sort((a, b) => b.ratings.compound_score - a.ratings.compound_score));
            this.pullAllCompleted = true;
        },
        async pullOne(fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>, id: string)
        {
            if (!/^[0-9a-fA-F]{24}$/.test(id))
            {
                throw new Error("Course not found");
            }

            const cacheSearch = get(this).find(course => course._id === id);

            if (cacheSearch) return cacheSearch;
            
            const query = `${import.meta.env.VITE_API_URL}course?${new URLSearchParams({id})}`;
            const resp = await fetch(query).catch(err => {console.error(err); throw err});
            const data = await resp.json().catch(err => {console.error(err); throw err}) as CourseViewResponse;

            if (data.data.length !== 1) throw new Error("Course not found");
            this.update(c => [...c, data.data[0]]);
            return data.data[0];
        }
    }
})();

type QueryPages = "courses" | "professors" | "reviews";

const defaultFields: {[key in QueryPages]: SidebarFields} = {
    courses: [
        {name: "code", label: "Code", type: "text", selected: false, value: "", options: []},
        {name: "name", label: "Name", type: "text", selected: false, value: ""},
        {name: "faculty", label: "Faculty", type: "text", selected: false, value: ""},
        {name: "semester", label: "Semester", type: "text", selected: false, value: "", options: []},
        {name: "department", label: "Department", type: "text", selected: false, value: "", options: []},
        {name: "sample_size", label: "Review Count", type: "number", selected: false, value: [1, 1000], range: [0, 1000]},
        {name: "engaging", label: "Engaging Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "interesting_material", label: "Material Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "grading", label: "Grading Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "workload", label: "Workload Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "attendance", label: "Attendance Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "TFs", label: "TA/TF Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "holistic", label: "Holistic Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
        {name: "compound_score", label: "Compound Rating", type: "number", selected: false, value: [0, 5], range: [0, 5]},
    ],
    professors: [],
    reviews: []
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

export const sidebarState = (() => {
    const _store = writable<{open: boolean, page: QueryPages, component?: typeof SvelteComponent, props?: any, fields: {[key in QueryPages]: SidebarFields}}>({
        open: false,
        page: "courses",
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

type CurrentPage = {courses: number, faculty: number, reviews: number}

export const currentPageStore = writable<CurrentPage>({courses: 0, faculty: 0, reviews: 0});
export const itemsPerPage = 84;
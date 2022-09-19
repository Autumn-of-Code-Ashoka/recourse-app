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
            this.set(data.data);
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
            console.log(query);
            const resp = await fetch(query).catch(err => {console.error(err); throw err});
            const data = await resp.json().catch(err => {console.error(err); throw err}) as CourseViewResponse;

            if (data.data.length !== 1) throw new Error("Course not found");
            this.update(c => [...c, data.data[0]]);
            return data.data[0];
        }
    }
})();

type SidebarFields = {
    name: string,
    type: "text" | "number",
    label: string,
    value: string | [number, number],
    range?: [number, number],
    options?: {value: string, label: string}[],
    selected: boolean
}[];

export const sidebarState = (() => {
    const _store = writable<{open: boolean, fields: SidebarFields}>({
        open: false,
        fields: [],
    });

    return {
        subscribe: _store.subscribe,
        set: _store.set,
        open(fields: SidebarFields) 
        {
            const current = get(this).fields;
            const newFields = fields.map(field => {
                const existing = current.find(f => f.name === field.name);

                if (existing)
                {
                    return {...field, selected: existing.selected, value: existing.value};
                }

                return field;
            });
            _store.set({open: true, fields: newFields});
        },
        close()
        {
            _store.update(s => ({...s, open: false}));
        },
        toggle(ind: number)
        {
            _store.update(s => {
                const fields = [...s.fields];
                fields[ind].selected = !fields[ind].selected;
                return {...s, fields};
            });
        }
    }
})();
import { writable } from "svelte/store";
import type { CourseViewResponse } from "./types";

export const courses = writable<CourseViewResponse["data"]>([]);
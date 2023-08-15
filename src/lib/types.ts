export type Faculty = {
    name: string,
    email: string,
    _id: string;
};

export function CreatePeopleString(people: Faculty[], trunc = 2)
{
    if (people.length === 1) return people[0].name;
    if (people.length === 0) return "Unknown";

    const names = people.map(person => person.name);
    const truncated = names.length > trunc;
    return truncated ? `${names.slice(0, trunc).join(", ")}, and others...` : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export type ViewResponse = {
    data: Array<{
        _id: string,
        ratings: RatingAggregate,
    }>
}

export type RatingAggregate = {
    [x: string]: number,
    sample_size: number,
    engaging: number,
    interesting_material: number,
    grading: number,
    workload: number,
    attendance: number,
    TFs: number,
    holistic: number,
    compound_score: number,
};

export type CourseViewResponse = {
    data: {
        faculty: {
            professors: Faculty[],
            TFs: Faculty[],
        }
        ratings: RatingAggregate,
        _id: string,
        code: string[],
        name: string,
        department: string,
        document: string,
        semester: string,
        html_details: string,
        _v: number,
        reviews: string[],
    }[];
};

export type ProfViewResponse = {
    data: {
        ratings: RatingAggregate,
        _id: string,
        name: string,
        position: string,
        qualification: string,
        email: string,
        profile_link: string,
        profile_image: string,
        link: string,
        image: string,
        department: string,
        courses_offered: string[],
        reviews: string[],
    }[];
};

export type ReviewViewResponse = {
    data: {
        ratings: RatingAggregate,
        _id: string,
        course_id: string,
        timestamp: string,
        code: string[],
        semester: string,
        review: string,
        verified: boolean,
    }[];
};
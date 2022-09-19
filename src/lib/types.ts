export type Faculty = {
    name: string,
    email: string,
    _id: string;
};

export type RatingAggregate = {
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
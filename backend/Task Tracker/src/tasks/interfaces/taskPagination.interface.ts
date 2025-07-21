export interface ITaskPagination {
    limit: number;
    page: number;
    order: "asc" | "dsc";
    userId: string;
}
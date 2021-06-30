export interface IPagination<T> {
    data: T[];
    page: number;
    limit: number;
    lastPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalItems: number;
}

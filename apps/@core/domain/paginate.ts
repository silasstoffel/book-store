export interface AdditionalProperties {
    page?: number;
    next?: number | null;
    previous?: number | null;
}

export interface Paginate<T> {
    data: T[]
    hasMore: boolean
    info?: AdditionalProperties
}

export type SortMode = 1 | -1

export interface PaginateArgs {
    page: number;
    limit?: number;
    sort?: Record<string, SortMode>;
}

export const LIMIT_DEFAULT = 12

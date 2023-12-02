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

export interface PaginateArgs {
    page: number;
    limit?: number;
}

export const LIMIT_DEFAULT = 12

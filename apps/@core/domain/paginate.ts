export interface AdditionalProperties {
    startingAfter?: number;
    endingBefore?: number | null;
    counter?: number;
}

export interface Paginate<T> {
    data: T[]
    hasMore: boolean
    info?: AdditionalProperties
}

export interface PaginateArgs {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
}

export const LIMIT_DEFAULT = 12

export const buildPaginateResponse = (args: PaginateArgs, data = []) => {
    const { limit } = { limit: LIMIT_DEFAULT, ...args }
    if (data.length && args?.endingBefore) {
        data.pop()
    }
    const counter = data.length
    const hasMore = counter > limit
    data = args?.endingBefore ? data.reverse() : data

    return {
        hasMore,
        data,
        info: {
            startingAfter: counter ? data[counter-1].id: null,
            endingBefore: counter ? data[0].id : null,
        }
    }
}

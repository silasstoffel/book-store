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
    const { limit } = args
    const counter = data.length
    const hasMore = counter > limit

    if (counter && args.endingBefore) {
        data.pop()
    }

    data = args.endingBefore ? data.reverse() : data

    return {
        hasMore,
        data,
        info: {
            startingAfter: counter ?? data[0].id,
            endingBefore: counter ?? data[counter-1].id,
        }
    }
}

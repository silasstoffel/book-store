interface Record {
    id: string
}
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

export const buildPaginateResponse = <T>(args: PaginateArgs, data:T[]): Paginate<T> => {
    const { limit } = { limit: LIMIT_DEFAULT, ...args }
    let counter = data.length
    const hasMore = counter > limit

    if (hasMore) {
        data.pop()
        counter -=1
    }
    data = args?.endingBefore ? data.reverse() : data

    return {
        hasMore,
        data,
        info: {
            startingAfter: hasMore ? data[counter-1]?.id: null,
            endingBefore: counter ? data[0]?.id : null,
        }
    }
}

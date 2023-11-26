interface ResponseSchema {
    statusCode: number;
    body: string;
}

export function http(data?: unknown | null, code = 200): ResponseSchema {
    const body = data ? JSON.stringify(data) : '';
    return { statusCode: code, body };
}

export function httpOk(data?: unknown | null): ResponseSchema {
    return http(data, 200);
}

export function httpCreated(data?: unknown | null): ResponseSchema {
    return http(data, 200);
}

export function httpNotFound(data?: unknown | null): ResponseSchema {
    return http(data, 404);
}

export function httpEmpty(): ResponseSchema {
    return http(null, 204);
}


export function http(data: unknown, code = 200) {
    return {
        statusCode: code,
        body: JSON.stringify(data),
    };
}

export function httpOk(data: unknown) {
    return http(data, 200);
}

export function httpCreated(data: unknown) {
    return http(data, 200);
}

export function httpNotFound(data: unknown) {
    return http(data, 404);
}

export function httpEmpty() {
    return http({}, 204);
}

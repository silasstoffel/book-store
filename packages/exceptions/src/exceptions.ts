export interface ExceptionAdditionalParams {
    httpStatusCode?: number;
}

export class BaseException extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly additionalParams?: ExceptionAdditionalParams,
    ) {
        super(message);
        this.name = 'BaseException';
    }
}

export class UnknownException extends BaseException {
    constructor() {
        super('Unknown error.', 'UNKNOWN_ERROR', { httpStatusCode: 500})
        this.name = 'UnknownException';
    }
}

export class EntityNotFoundException extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly additionalParams: ExceptionAdditionalParams = { httpStatusCode: 404 },
    ) {
        super(message);
        this.name = 'EntityNotFoundException';
    }
}

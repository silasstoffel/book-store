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

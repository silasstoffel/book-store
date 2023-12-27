import { BaseException } from '@package/exceptions';

export class IntegrationErrorException extends BaseException {
    constructor(
        public readonly payload: string,
        public readonly payloadFormat: 'json',
        httpStatusCode = 500
    ) {
        super(
            `Integration error. Detail: ${payload}`,
            'INTEGRATION_ERROR',
            { httpStatusCode }
        );
        this.name = 'InactiveProductException';
    }
}

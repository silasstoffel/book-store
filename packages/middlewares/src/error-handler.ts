import { MiddlewareObj } from '@middy/core';
import { BaseException, UnknownException } from '@package/exceptions';
import { ILogger, Logger } from '@packages/logger'
import { Context } from 'aws-lambda';

interface Event {
    httpMethod?: string
    Records?: Record<string, unknown>[]
    'detail-type'?: string
}

interface Handler {
    event: Event
    context: Context
    error?: BaseException | UnknownException | Error
}

enum EventType {
    API_GATEWAY = 'API_GATEWAY',
    SQS = 'SQS',
    EVENT_BRIDGE = 'EVENT_BRIDGE',
    UNKNOWN = 'UNKNOWN'
}

const getEventType = (event: Event): EventType => {
    if (event?.httpMethod) {
        return EventType.API_GATEWAY
    }

    if (event?.Records && event.Records.length > 0 && event.Records[0]["eventSource"] === 'aws.sqs') {
        return EventType.SQS
    }

    if (event?.Records && event.Records.length > 0 && event.Records[0]["eventSource"] === 'aws.sqs') {
        return EventType.SQS
    }

    return EventType.UNKNOWN
}

const unknownError = (logger: ILogger, handler: Handler) => {
    const error = handler.error;
    logger.error('Unknown event type', error);
    console.error(JSON.stringify(error, null, 2));
    return {
        statusCode: 500,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ code: 'UNKNOWN_ERROR', message: 'Unknown server error' })
    };
}

const httpError = (logger: ILogger, handler: Handler) => {
    let statusCode = 500
    let body = { code: 'UNKNOWN_ERROR', message: 'Unknown server error' }

    if (handler.error instanceof BaseException) {
        const exception = handler.error as BaseException;
        statusCode = exception.additionalParams?.httpStatusCode || 500,
        body = { code: exception.code, message: exception.message }
        logger.error(exception.message, exception, { statusCode, body});
    }

    return {
        statusCode,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ErrorHandlerMiddleware = (): MiddlewareObj<any, any, any, Context> => ({
    onError: async (handler) => {
        const logger = Logger.build({ context: handler.context });
        const eventType = getEventType(handler.event);

        switch (eventType) {
            case EventType.API_GATEWAY:
                return httpError(logger, handler);
            default:
                return unknownError(logger, handler);
        }
    },
});

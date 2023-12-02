import { z } from 'zod';
import { APIGatewayEvent } from 'aws-lambda';

interface Handler {
    event: APIGatewayEvent
}

interface ZodErrorDetails {
    field: string
    message: string
    path: string[]
}

interface ZodError {
    errors: ZodErrorDetails[]
}

export const HttpValidatorMiddleware = (schema: z.AnyZodObject) => {
    const  before = async (handler: Handler) => {
        const { event: { body } } = handler;
        try {
            const parsedBody = JSON.parse(body || '{}');
            schema.parse(parsedBody);
            return undefined;
        } catch (error) {
            const details = error as ZodError;
            const errors = details.errors.map((err) => {
                return {
                    field: err.path.join('.'),
                    message: err.message,
                };
            });

            return {
                statusCode: 400,
                body: JSON.stringify({
                    code: 'INVALID_BODY',
                    message: 'Validation failed.',
                    errors
                })
            }
        }
    }

    return { before, after: undefined, onError: undefined }
}

export const HttpPathValidatorMiddleware = (schema: z.AnyZodObject) => {
    const  before = async (handler: Handler) => {
        const path = handler.event.pathParameters;
        try {
            schema.parse(path ?? {});
            return undefined;
        } catch (error) {
            const details = error as ZodError;
            const errors = details.errors.map((err) => {
                return {
                    field: err.path.join('.'),
                    message: err.message,
                };
            });

            return {
                statusCode: 400,
                body: JSON.stringify({
                    code: 'INVALID_PATH_PARAMETERS',
                    message: 'Validation failed.',
                    errors
                })
            }
        }
    }

    return { before, after: undefined, onError: undefined }
}

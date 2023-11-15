import { z } from 'zod';

interface Event {
    event: {
        body: string
    }
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
    const  before = async (handler: Event) => {
        const { event: { body } } = handler;
        try {
            const parsedBody = JSON.parse(body || '{}');
            schema.parse(parsedBody);
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

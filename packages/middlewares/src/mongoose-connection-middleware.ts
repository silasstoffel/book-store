import { Logger } from '@packages/logger'
import { MongooseConnectionManager } from '@packages/mongoose-sidecar';
import { Error } from 'mongoose';
interface Handler {
    context: {
        callbackWaitsForEmptyEventLoop: boolean
    }
}

export const MongooseConnectionMiddleware = () => {
    const logger = Logger.build();
    const { MONGO_URI } = process.env;

    const before = async (handler: Handler) => {
        logger.info('Trying to connecting on MongoDb');
        handler.context.callbackWaitsForEmptyEventLoop = false
        try {
            await MongooseConnectionManager.connect(String(MONGO_URI));
            logger.info('Connected to MongoDB');
        } catch (error) {
            logger.error(
                'Error to connect MongoDb',
                error as Error,
                { source: 'MongooseConnectionMiddleware' }
            );
            throw error;
        }
        return undefined;
    };

    const after = async () => {
        return undefined;
    };

    const onError = async () => {
        logger.error('Error to connect MongoDb');
        return {
            statusCode: 500,
            body: JSON.stringify({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong.',
            }),
        }
    };

    return { before, after, onError };
}

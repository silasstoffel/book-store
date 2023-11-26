import { Logger } from '@packages/logger'
import mongoose, { Error } from 'mongoose'
interface Handler {
    context: {
        callbackWaitsForEmptyEventLoop: boolean
    }
}

let connection: mongoose.Connection | null = null;

export const MongooseConnectionMiddleware = () => {
    const logger = Logger.build();
    const { MONGO_URI } = process.env;

    const before = async (handler: Handler) => {
        logger.info('Trying to creating a new connection or get a existing connection');
        handler.context.callbackWaitsForEmptyEventLoop = false
        try {
            if (!connection) {
                logger.info('Creating a new connection');
                await mongoose.connect(String(MONGO_URI), {
                    serverSelectionTimeoutMS: 3000,
                });
                connection = mongoose.connection
                logger.info('Connected to MongoDB');
            } else {
                logger.info('Using existing connection.');
            }
        } catch (error) {
            logger.error(
                'Error to connect MongoDb.',
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
                message: 'Database connection failure.',
            }),
        }
    };

    return { before, after, onError };
}

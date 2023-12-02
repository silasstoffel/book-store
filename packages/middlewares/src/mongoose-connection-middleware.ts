import { Logger } from '@packages/logger'
import { Context } from 'aws-lambda';
import mongoose, { Error } from 'mongoose'
interface Handler {
    context: Context
}

let connection: mongoose.Connection | null = null;

export const MongooseConnectionMiddleware = () => {
    const { MONGO_URI } = process.env;

    const before = async (handler: Handler) => {
        const logger = Logger.build({ context: handler.context });
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

    return { before, after, onError: undefined };
}

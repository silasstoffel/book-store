import mongoose from 'mongoose'
import { Logger } from '@packages/logger'

interface Handler {
    context: {
        callbackWaitsForEmptyEventLoop: boolean
    }
}

export const MongooseConnectionMiddleware = () => {
    const logger = Logger.build();
    const { MONGO_URI } = process.env;

    const before = async (handler: Handler) => {
        logger.info('Connecting to MongoDB');
        handler.context.callbackWaitsForEmptyEventLoop = false
        await mongoose.connect(String(MONGO_URI), {
            serverSelectionTimeoutMS: 3000
        });
        logger.info('Connected to MongoDB');
        return undefined;
    };

    const after = async () => {
        logger.info('Closing MongoDB connection');
        await mongoose.connection.close();
        logger.info('Closed MongoDB connection');
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

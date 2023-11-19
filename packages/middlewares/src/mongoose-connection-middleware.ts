import mongoose from 'mongoose'
import { Logger } from '@packages/logger'

export const MongooseConnectionMiddleware = () => {
    const logger = Logger.build();
    const { MONGO_URI } = process.env;

    const before = async () => {
        logger.info('Connecting to MongoDB');
        await mongoose.connect(String(MONGO_URI));
        logger.info('Connected to MongoDB');
        return undefined;
    };

    const after = async () => {
        logger.info('Closing MongoDB connection');
        await mongoose.disconnect();
        logger.info('Closed MongoDB connection');
        return undefined;
    };

    const onError = async () => {
        logger.info('Error to connect MongoDb');
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

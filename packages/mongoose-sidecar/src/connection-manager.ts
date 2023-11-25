import mongoose, { Mongoose } from 'mongoose';

export class MongooseConnectionManager {
    private static connection: Mongoose | null = null;

    static getConnection(): Mongoose {
        if (!MongooseConnectionManager.connection) {
            throw new Error('Connection not found.');
        }
        return MongooseConnectionManager.connection
    }

    static async connect(uri: string, options?: mongoose.ConnectOptions) {
        const defaultOptions = {
            serverSelectionTimeoutMS: 3000,
            ...options
        };
        const conn = await mongoose.connect(uri, defaultOptions);
        MongooseConnectionManager.connection = conn;
    }
}

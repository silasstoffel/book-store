/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger as AwsLogger } from '@aws-lambda-powertools/logger';
import { ILogger } from './ilogger';

const { SERVICE_NAME, LOG_LEVEL } = process.env;

const levelsBuilder = (data?: string): LoggerLevel[] => {
    if (data) {
        const items = data.toLowerCase().split(',');
        const values = Object.keys(LoggerLevel).filter(
            (level) => items.includes(level)
        );

        return values.length ? values as LoggerLevel[] : [LoggerLevel.ALL];
    }
    return [LoggerLevel.ALL]
}

export enum LoggerLevel {
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    WARN = 'WARN',
    ERROR = 'ERROR',
    ALL = 'ALL'
}

export enum LoggerEnvironment {
    DEVELOPMENT = 'DEBUG',
    PRODUCTION = 'WARN',
}

interface LoggerParams {
    serviceName?: string;
    environment?: LoggerEnvironment;
    levels?: LoggerLevel[];
}

const defaults: LoggerParams = {
    serviceName: SERVICE_NAME ? SERVICE_NAME: 'unknown-service',
    environment: LoggerEnvironment.DEVELOPMENT,
    levels: levelsBuilder(LOG_LEVEL),
};

export class Logger implements ILogger {
    private readonly logger: AwsLogger;
    private readonly params: LoggerParams;

    constructor(params?: LoggerParams) {
        this.params = { ...defaults, ...params };
        const persistentLogAttributes = {
            service: this.params.serviceName,
            environment: this.params.environment,
        }
        this.logger = new AwsLogger({ ...this.params, persistentLogAttributes });
    }

    public info(message: string, data?: any): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.INFO)) {
            this.logger.info(message, data);
        }
    }

    public warn(message: string, data?: any): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.WARN)) {
            this.logger.warn(message, data);
        }
    }

    public debug(message: string, data?: any): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.DEBUG)) {
            this.logger.debug(message, data);
        }
    }

    public error(message: string, error?: Error, data?: any): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.ERROR)) {
            this.logger.error(message, { error, ...data});
        }
    }

    public static build(params?: LoggerParams): Logger {
        return new Logger(params);
    }
}

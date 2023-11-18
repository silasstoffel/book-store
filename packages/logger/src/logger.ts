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

    constructor(private readonly params?: LoggerParams) {
        this.params = { ...defaults, ...params };
        this.logger = new AwsLogger({ ...this.params });
    }

    public info(message: string, data?: object): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.INFO)) {
            const persistentLogAttributes = this.buildPersistentLogAttributes();
            this.logger.info(message, {...persistentLogAttributes, ...data});
        }
    }

    public warn(message: string, data?: object): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.WARN)) {
            const persistentLogAttributes = this.buildPersistentLogAttributes();
            this.logger.warn(message, {...persistentLogAttributes, ...data});
        }
    }

    public debug(message: string, data?: object): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.DEBUG)) {
            const persistentLogAttributes = this.buildPersistentLogAttributes();
            this.logger.debug(message, {...persistentLogAttributes, ...data});
        }
    }

    public error(message: string, error?: Error, data?: object): void {
        if (this.params?.levels?.includes(LoggerLevel.ALL) || this.params?.levels?.includes(LoggerLevel.ERROR)) {
            const persistentLogAttributes = this.buildPersistentLogAttributes();
            this.logger.error(message, { error, ...persistentLogAttributes, ...data});
        }
    }

    public static build(params?: LoggerParams): Logger {
        return new Logger(params);
    }

    private buildPersistentLogAttributes(): object {
        return {
            service: this.params.serviceName,
            environment: this.params.environment,
        }
    }
}

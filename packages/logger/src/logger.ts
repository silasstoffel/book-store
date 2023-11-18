/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger as AwsLogger } from '@aws-lambda-powertools/logger';
import { ILogger } from './ilogger';

const { SERVICE_NAME, LOG_LEVEL } = process.env;

export enum Level {
    DEBUG = 8,
    INFO = 12,
    WARN = 16,
    ERROR = 20,
    CRITICAL = 24,
    SILENT = 28,
}

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    STAGING = 'staging',
}

interface BaseLoggerParams {
    serviceName?: string;
    environment?: Environment;
    context?: any
}

interface LoggerParams extends BaseLoggerParams { level: Level }

interface BuildLoggerParams extends BaseLoggerParams { level?: Level }

const levelBuilder = (level?: string): number => {
    if (!level) {
        return Level.INFO;
    }
    return Object.values(Level).includes(level) ? Number(level) : Level.INFO;
}

const defaults: LoggerParams = {
    serviceName: SERVICE_NAME ? SERVICE_NAME as string: 'unknown-service',
    environment: Environment.DEVELOPMENT,
    level: levelBuilder(LOG_LEVEL),
}

export class Logger implements ILogger {
    private readonly logger: AwsLogger;
    private readonly params: LoggerParams;

    constructor(params?: LoggerParams) {
        this.params = { ...defaults, ...params };
        const persistentLogAttributes = {
            service: this.params.serviceName,
            environment: this.params.environment,
            context: this.params?.context,
        }
        this.logger = new AwsLogger({ ...this.params, persistentLogAttributes });
    }

    public info(message: string, data?: any): void {
        if (this.params.level <= Level.INFO) {
            this.logger.info(message, data);
        }
    }

    public warn(message: string, data?: any): void {
        if (this.params.level <= Level.WARN) {
            this.logger.warn(message, data);
        }
    }

    public debug(message: string, data?: any): void {
        if (this.params.level <= Level.DEBUG) {
            this.logger.debug(message, data);
        }
    }

    public error(message: string, error?: Error, data?: any): void {
        if (this.params.level <= Level.ERROR) {
            this.logger.error(message, { error, ...data});
        }
    }

    public static build(params?: BuildLoggerParams): Logger {
        return new Logger({ level: Level.INFO, ...params });
    }
}

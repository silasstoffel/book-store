import type { AWS } from '@serverless/typescript'
import { SystemManager } from './infra/system-manager';
import { EventBridge } from './infra/event-bridge';

const systemManager = new SystemManager()
const eventBridge = new EventBridge()

export function serverlessSidecar(config: AWS): AWS {
    const sls: AWS = config;

    sls.frameworkVersion = '3'

    sls.provider.name = 'aws';
    sls.provider.runtime = 'nodejs18.x';
    sls.provider.region = 'us-east-1';
    sls.provider.timeout = 15;
    sls.provider.stage = 'dev';
    sls.provider.tracing = { lambda: false };
    sls.provider.logRetentionInDays = 1
    sls.provider.environment.LOG_LEVEL = 'DEBUG'
    sls.provider.environment.MONGO_URI = '${ssm:/book-store/mongo/connection-string}'

    if (!sls.provider.iam?.role["statements"]) {
        sls.provider = {
          ...config.provider,
          iam: {role: { statements: [] } },
        }
    }

    config.provider.iam.role['statements'].push(
        ...systemManager.getRoles(),
        ...eventBridge.getRoles(),
    )

    if (!config.resources) {
        config.resources = {
          Resources: {},
        }
    }

    config.resources.Resources = {
       ...eventBridge.getResource(),
    }

    sls.package = { individually: true }
    sls.plugins = ['serverless-esbuild', 'serverless-offline']

    if (!sls.custom) {
      sls.custom = {}
    }

    sls.custom.esbuild = {
      bundle: true,
      minify: true,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node18',
      platform: 'node',
      concurrency: 10,
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: ['temp/**/*'],
      },
    }

    return sls;
}

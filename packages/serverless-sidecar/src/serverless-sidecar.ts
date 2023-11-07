import type { AWS } from '@serverless/typescript'

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

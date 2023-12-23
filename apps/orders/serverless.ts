import type { AWS } from '@serverless/typescript'
import { serverlessSidecar } from '@packages/serverless-sidecar'
import functions from './src/infra/handlers'

const serverless: AWS = {
    service: 'bookstore-orders',
    provider: {
        name: 'aws',
        memorySize: 128,
        environment: {
            SERVICE_NAME: 'bookstore-orders',
        }
    },
    functions
}

module.exports = serverlessSidecar(serverless)

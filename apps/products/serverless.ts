import type { AWS } from '@serverless/typescript'
import { serverlessSidecar } from '@packages/serverless-sidecar'
import functions from './src/handlers'

const serverless: AWS = {
    service: 'bookstore-products',
    provider: {
        name: 'aws',
        memorySize: 128,
        environment: {
            SERVICE_NAME: 'bookstore-products',
        }
    },
    functions
}

module.exports = serverlessSidecar(serverless)

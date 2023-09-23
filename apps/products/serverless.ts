import type { AWS } from '@serverless/typescript'
import { serverlessSidecar } from '@packages/serverless-sidecar'
import functions from './src/handlers'

// force deploy: 1
const serverless: AWS = {
    service: 'bookstore-products',
    provider: {
        name: 'aws',
        memorySize: 128,
        environment: {}
    },
    functions
}

module.exports = serverlessSidecar(serverless)

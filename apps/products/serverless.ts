import type { AWS } from '@serverless/typescript'
import { serverlessSidecar } from '@packages/serverless-sidecar'
// force deploy: 1
const serverless: AWS = {
    service: 'bookstore-products',
    provider: {
        name: 'aws',
        memorySize: 128,
        environment: {}
    }
}

module.exports = serverlessSidecar(serverless)

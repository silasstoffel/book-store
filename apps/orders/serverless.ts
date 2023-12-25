import type { AWS } from '@serverless/typescript'
import { serverlessSidecar } from '@packages/serverless-sidecar'
import { InvokePermission } from './src/infra/aws/invoke-permission'
import functions from './src/infra/handlers'

const invokePermission = new InvokePermission()

const serverless: AWS = {
    service: 'bookstore-orders',
    provider: {
        name: 'aws',
        memorySize: 128,
        environment: {
            SERVICE_NAME: 'bookstore-orders',
        },
        iam: {
            role: {
                statements: [
                    ...invokePermission.getRoles()
                ]
            }
        }
    },
    functions
}

module.exports = serverlessSidecar(serverless)

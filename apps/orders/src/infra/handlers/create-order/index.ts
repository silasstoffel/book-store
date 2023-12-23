import { handlerPath } from '@packages/serverless-utils'

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'POST',
                path: '/v1/orders',
            }
        }
    ]
}

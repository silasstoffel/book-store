import { handlerPath } from '@packages/serverless-utils'

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'GET',
                path: '/v1/products/{product}',
            }
        }
    ]
}

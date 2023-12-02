import { handlerPath } from '@packages/serverless-utils'

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'PUT',
                path: '/v1/products/{product}',
            }
        }
    ]
}

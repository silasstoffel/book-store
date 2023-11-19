import { APIGatewayEvent, Context } from "aws-lambda";
import { ulid } from 'ulid'
import middy from '@middy/core'
import { HttpValidatorMiddleware, MongooseConnectionMiddleware } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { createProductSchema } from './schema'


const handler = async (event: APIGatewayEvent, context: Context) => {
    const logger = Logger.build({ context})
    logger.info('info logger')
    return {
        statusCode: 201,
        body: JSON.stringify({
            id: ulid(),
        })
    }
};

export const main = middy(handler)
    .use(MongooseConnectionMiddleware())
    .use(HttpValidatorMiddleware(createProductSchema))

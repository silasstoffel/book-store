import { APIGatewayEvent } from "aws-lambda";
import { ulid } from 'ulid'
import middy from '@middy/core'
import { HttpValidatorMiddleware } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { createProductSchema } from './schema'

const handler = async (event: APIGatewayEvent) => {
    const logger = Logger.build()
    logger.info('info logger', event)
    logger.warn('warn logger', event)
    logger.error('error logger', Error('Fake error'), event)
    logger.debug('debug logger', event)

    return {
        statusCode: 201,
        body: JSON.stringify({
            id: ulid(),
        })
    }
};

export const main = middy(handler)
    .use(HttpValidatorMiddleware(createProductSchema))

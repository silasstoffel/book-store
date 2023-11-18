import { APIGatewayEvent } from "aws-lambda";
import { ulid } from 'ulid'
import middy from '@middy/core'
import { HttpValidatorMiddleware } from '@packages/middlewares'
import { Logger } from '@packages/logger'
import { createProductSchema } from './schema'

const handler = async (event: APIGatewayEvent) => {
    const logger = Logger.build()

    const body = JSON.parse(event.body || '{}')
    const parsedBody = createProductSchema.parse(body)

    logger.info('info logger', { body, parsedBody })
    logger.warn('warn logger without data')
    logger.error('error logger', Error('Fake error'), parsedBody)
    logger.debug('debug logger', { body, additional: 'additional info'})

    return {
        statusCode: 201,
        body: JSON.stringify({
            id: ulid(),
        })
    }
};

export const main = middy(handler)
    .use(HttpValidatorMiddleware(createProductSchema))

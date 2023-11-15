import { APIGatewayEvent } from "aws-lambda";
import { ulid } from 'ulid'
import middy from '@middy/core'
import { HttpValidatorMiddleware } from '@packages/middlewares'
import { createProductSchema } from './schema'


const handler = async (event: APIGatewayEvent) => {
    console.log('Event detail', JSON.stringify(event.body, null, 2));
    return {
        statusCode: 201,
        body: JSON.stringify({
            id: ulid(),
        })
    }
};

export const main = middy(handler)
    .use(HttpValidatorMiddleware(createProductSchema))

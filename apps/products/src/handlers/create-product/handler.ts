import { APIGatewayEvent } from "aws-lambda";
import { ulid } from 'ulid'

export const main = async (event: APIGatewayEvent) => {
    console.log('Event detail', JSON.stringify(event, null, 2));

    return {
        statusCode: 201,
        body: JSON.stringify({
            id: ulid(),
        })
    }
};

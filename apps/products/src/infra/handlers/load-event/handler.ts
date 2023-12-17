import { EventBridgeEvent, Context } from "aws-lambda";
import { middify } from '@packages/middlewares'
import { Logger } from '@packages/logger'

const handler = async (event: EventBridgeEvent<'', unknown>, context: Context) => {
    const logger = Logger.build({ context });
    const payload = {
        ...event,
        detail: JSON.parse(event.detail as string)
    }
    logger.info('Received event', payload);

    return 'Finished'
};

export const main = middify(handler)

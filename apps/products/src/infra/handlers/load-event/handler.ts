import { EventBridgeEvent, Context } from "aws-lambda";
import { middify } from '@packages/middlewares'
import { Logger } from '@packages/logger'

const handler = async (event: EventBridgeEvent<'', unknown>, context: Context) => {
    const logger = Logger.build({ context });
    logger.info('Received event', event);

    return 'Finished'
};

export const main = middify(handler)

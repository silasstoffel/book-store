import { handlerPath } from '@packages/serverless-utils'
import { Event } from '@packages/events'

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        eventBridge: {
          eventBus: {
            arn: 'arn:aws:events:us-east-1:808056304349:event-bus/book-store',
          },
          pattern: {
            'detail-type': [
              Event.PRODUCT_CREATED,
              Event.PRODUCT_UPDATED,
              Event.PRODUCT_DELETED,
            ],
          },
        },
      },
    ],
  };






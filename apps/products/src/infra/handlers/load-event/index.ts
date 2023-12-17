import { handlerPath } from '@packages/serverless-utils'
import { Event } from '@packages/events'

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        eventBridge: {
          eventBus: {
            arn: {
                'Fn::Sub': 'arn:aws:events:${AWS::Region}:${AWS::AccountId}:event-bus/book-store',
            },
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






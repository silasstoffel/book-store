import { handlerPath } from '@packages/serverless-utils'
import { Event } from '@packages/events'

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
      {
        eventBridge: {
          eventBus: {
            arn: {
              'Fn::Join': [
                '',
                [
                  'arn:aws:events',
                  ':',
                  '${self:provider.region}',
                  ':',
                  { 'Fn::Sub': '${AWS::AccountId}' },
                  ':',
                  'event-bus/book-store',
                ],
              ],
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


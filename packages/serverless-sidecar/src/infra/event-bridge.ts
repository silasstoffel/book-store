export class EventBridge {
    public readonly resourceName = 'BookStoreEventBus'
    getResource() {
        return {
            [this.resourceName]: {
                Type: 'AWS::Events::EventBus',
                Properties: {
                    Name: 'book-store',
                    Tags: [
                        { Key: 'service', Value: 'book-store' }
                    ],
                },
            }
        };
    }

    getRoles() {
        return [
            {
              Effect: 'Allow',
              Action: ['events:PutEvents'],
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:aws:events',
                    ':',
                    '${self:provider.region}',
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    'event-bus/default',
                  ],
                ],
              },
            },
        ];
    }
}

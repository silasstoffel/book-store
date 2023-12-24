export class EventBridge {
    public readonly resourceName = 'BookStoreEventBus'

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

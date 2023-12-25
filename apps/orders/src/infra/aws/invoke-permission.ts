export class InvokePermission {
    getRoles() {
        return [
            {
                Effect: 'Allow',
                Action: ['lambda:InvokeFunction'],
                Resource: [
                    'arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:bookstore-products-${self:provider.stage}-get-product',
                ],
            },
        ];
    }
}

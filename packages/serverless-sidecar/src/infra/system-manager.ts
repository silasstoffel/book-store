export class SystemManager {
    getRoles() {
        return [
            {
                Effect: 'Allow',
                Action: [
                    'ssm:GetParameters',
                    'ssm:GetParameter',
                    'ssm:GetParametersByPath',
                ],
                Resource: [
                    'arn:aws:ssm:${aws:region}:${aws:accountId}:parameter/book-store/*',
                ],
            },
        ];
    }
}

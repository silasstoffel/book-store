export class SystemManager {
    getStatements() {
        return [
            {
                Effect: 'Allow',
                Action: [
                    'ssm:GetParameters',
                    'ssm:GetParameter',
                    'ssm:GetParametersByPath',
                ],
                Resource: [
                    'arn:aws:ssm:*:*:parameter/book-store/*',
                ],
            },
        ];
    }
}

import { LambdaClient, InvokeCommand, InvocationType } from '@aws-sdk/client-lambda';
import { ILogger } from '@packages/logger';

export enum LambdaInvokeType {
    REQUEST_RESPONSE = 'RequestResponse',
    EVENT = 'Event',
}

export interface LambdaInvokeInput {
    function: string;
    invocationType?: LambdaInvokeType;
    pathParameters?: object;
    queryStringParameters?: object
    httpMethod?: string;
    headers?: object;
    path?: string;
    body?: object;
}

export class LambdaInvoke {

    private readonly client = new LambdaClient()

    constructor(private readonly logger: ILogger) {}

    async syncInvoke<T>(input: LambdaInvokeInput): Promise<T | null> {
        const params = this.buildInvokeParameters(input);
        this.logger.info('Invoking lambda', { ...params });

        try {
            const response = await this.client.send(new InvokeCommand(params));
            const { StatusCode,  Payload } = response

            if (StatusCode && (StatusCode < 200 || StatusCode > 299)) {
                const exc = new Error(`Status invoke is not ok. Status Code: ${StatusCode}`)
                this.logger.error('Error on lambda invoke', exc, {
                    statusCode: StatusCode,
                    payload: Payload,
                    function: input.function
                })
                throw exc;
            }

            if (Payload) {
                const data = JSON.parse(Buffer.from(Payload).toString()) as { body: string };
                const body = JSON.parse(data.body)
                this.logger.info('Lambda invoked', { ...params, statusCode: StatusCode, body });
                return JSON.parse(data.body) as T;
            }

        } catch (error) {
            this.logger.error('Error on lambda invoke', error as Error, { ...params });
            throw error;
        }

        return null
    }

    private buildPayload(input: LambdaInvokeInput) {
        const defaults = {
            httpMethod: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...input.headers
            },
            body: {}
        }

        const { pathParameters, httpMethod, headers, path, body } = {
            ...defaults, ...input
        }

        return {
            pathParameters,
            httpMethod,
            headers,
            path,
            body,
        }
    }

    private buildInvokeParameters(input: LambdaInvokeInput) {
        const payload = this.buildPayload(input);
        const params = { invocationType: LambdaInvokeType.REQUEST_RESPONSE, ...input };
        const invocationType = params.invocationType === LambdaInvokeType.REQUEST_RESPONSE ? InvocationType.RequestResponse : InvocationType.Event;

        return {
            FunctionName: input.function,
            InvocationType: invocationType,
            Payload: JSON.stringify(payload)
        };
    }
}

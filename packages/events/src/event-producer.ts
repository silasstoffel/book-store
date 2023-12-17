 import { IEventProducer } from './ievent-producer';
 import { Logger } from '@packages/logger';
 import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

export class EventProducer implements IEventProducer {

    constructor(
        private readonly logger = Logger.build(),
        private readonly client = new EventBridgeClient()
    ) {}

    async publish(eventType: string, message: object): Promise<void> {
        this.logger.info('Publishing event', { eventType });
        try {
            const command = new PutEventsCommand({
                Entries: [
                    {
                        EventBusName: 'book-store',
                        Source: eventType,
                        DetailType: eventType,
                        Detail: JSON.stringify(message),
                    },
                ],
            });
            await this.client.send(command);
        } catch (error) {
            this.logger.error('Error publishing event', error as Error, { eventType });
            throw error;
        }

        this.logger.info('Even published', { eventType });
    }
}

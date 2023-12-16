 import { IEventProducer } from './ievent-producer';
 import { Logger } from '@packages/logger';
 import { EventBridge } from 'aws-sdk'

export class EventProducer implements IEventProducer {

    constructor(
        private readonly logger = Logger.build(),
        private readonly client = new EventBridge()
    ) {}

    async publish(eventType: string, message: object): Promise<void> {
        this.logger.info('Publishing event', { eventType });
        try {
            await this.client.putEvents({
                Entries: [
                    {
                        EventBusName: 'book-store',
                        Source: eventType,
                        DetailType: eventType,
                        Detail: JSON.stringify(message),
                    },
                ],
            }).promise();
        } catch (error) {
            this.logger.error('Error publishing event', error as Error, { eventType });
            throw error;
        }

        this.logger.info('Even published', { eventType });
    }
}

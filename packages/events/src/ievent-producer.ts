export interface IEventProducer {
    publish(topic: string, message: unknown): Promise<void>;
}

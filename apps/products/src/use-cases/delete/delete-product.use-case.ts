import { IEventProducer, Event } from "@packages/events";
import { IProductRepository } from "../../domain/product.repository";

export class DeleteProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly eventProducer: IEventProducer
    ) {}

    public async execute(id: string): Promise<boolean> {
        const deleted = await this.productRepository.delete(id);
        if (deleted) {
            await this.eventProducer.publish(Event.PRODUCT_DELETED, { id });
        }
        return deleted;
    }
}

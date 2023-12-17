import { IEventProducer, Event } from "@packages/events";
import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";
import { UpdateProductInput } from "./update-product.input";

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly eventProducer: IEventProducer
    ) {}

    public async execute(id: string, product: UpdateProductInput): Promise<Product> {
        const record = await this.productRepository.update(id, product);
        await this.eventProducer.publish(Event.PRODUCT_UPDATED, record);
        return record
    }
}

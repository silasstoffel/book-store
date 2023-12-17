import { IEventProducer, Event } from "@packages/events";
import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";
import { CreateProductInput } from "./create-product.input";

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly eventProducer: IEventProducer
    ) {}

    public async execute(product: CreateProductInput): Promise<Product> {
        const record = await this.productRepository.create(new Product(product));
        await this.eventProducer.publish(Event.PRODUCT_CREATED, record);
        return record;
    }
}

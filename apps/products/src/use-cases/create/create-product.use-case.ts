import { ILogger } from "@packages/logger";
import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";
import { CreateProductInput } from "./create-product.input";
import { ProductNameAlreadyExistsException } from "../../domain/exceptions";

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly logger: ILogger
    ) {}

    public async execute(product: CreateProductInput): Promise<Product> {
        try {
            return await this.productRepository.create(new Product(product));
        } catch (error) {
            this.logger.error(
                'Error to create product.',
                error as Error,
                { product: product.name }
            );
            throw new ProductNameAlreadyExistsException()
        }
    }
}

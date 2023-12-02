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
        return this.productRepository.create(new Product(product));
    }
}

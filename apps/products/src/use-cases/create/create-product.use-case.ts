import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";
import { CreateProductInput } from "./create-product.input";

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {}

    public async execute(product: CreateProductInput): Promise<Product> {
        return this.productRepository.create(new Product(product));
    }
}

import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";
import { UpdateProductInput } from "./update-product.input";

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {}

    public async execute(id: string, product: UpdateProductInput): Promise<Product> {
        return this.productRepository.update(id, product);
    }
}

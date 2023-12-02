import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";

export class GetProductByIdUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {}

    public async execute(id: string): Promise<Product> {
        return this.productRepository.getById(id);
    }
}

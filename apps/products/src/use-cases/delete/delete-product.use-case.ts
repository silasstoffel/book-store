import { IProductRepository } from "../../domain/product.repository";

export class DeleteProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {}

    public async execute(id: string): Promise<boolean> {
        return this.productRepository.delete(id);
    }
}

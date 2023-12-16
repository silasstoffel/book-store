import { Paginate } from "@core/domain";
import { Product } from "../../domain/product.entity";
import { FindAllInput, IProductRepository } from "../../domain/product.repository";

export interface ListProductInput {
    limit?: number;
    name?: string;
    category?: string;
}

export class ListProductsUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {}

    public async execute(input: ListProductInput): Promise<Paginate<Product>> {
        return this.productRepository.findAll(input as FindAllInput);
    }
}

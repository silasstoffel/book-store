import { Paginate } from "@core/domain";
import { Product } from "../../domain/product.entity";
import { IProductRepository } from "../../domain/product.repository";

export interface ListProductInput {
    page?: number;
    limit?: number;
    name?: string;
    category?: string;
}

export class ListProductsUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {}

    public async execute(input: ListProductInput): Promise<Paginate<Product>> {
        const { page, limit, ...rest } = input;

        return this.productRepository.findAll({
            page,
            limit,
            filter: rest,
        });
    }
}

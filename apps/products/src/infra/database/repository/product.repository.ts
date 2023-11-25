import { IProductRepository } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import { Model } from 'mongoose';

export class ProductRepository implements IProductRepository {
    constructor(private readonly model: Model<Product>) {}

    async create(product: Product): Promise<Product> {
        const result = await this.model.create(product);
        return new Product(result);
    }
}
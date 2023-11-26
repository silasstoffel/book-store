import { IProductRepository } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import { Model } from 'mongoose';
import { ProductNameAlreadyExistsException } from '../../../domain/exceptions';
import { UnknownException } from '@package/exceptions';

export class ProductRepository implements IProductRepository {
    constructor(private readonly model: Model<Product>) {}

    async create(product: Product): Promise<Product> {
        try {
            const result = await this.model.create(product);
            return new Product(result);
        } catch (error) {
            if (error?.code === 11000) {
                throw new ProductNameAlreadyExistsException()
            }
            throw new UnknownException()
        }
    }
}

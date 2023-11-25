import { IProductRepository } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import productModel from '../model/product.model'

export class ProductRepository implements IProductRepository {
    async create(product: Product): Promise<Product> {
        const result = await productModel.create(product);
        return new Product(result);
    }
}

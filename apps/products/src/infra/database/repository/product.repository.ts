import { IProductRepository } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import getProductModel from '../model/product.model'

export class ProductRepository implements IProductRepository {
    async create(product: Product): Promise<Product> {
        const result = await getProductModel().create(product);
        return new Product(result);
    }
}

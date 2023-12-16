import { Product } from './product.entity';
import { Paginate, PaginateArgs } from '@core/domain';

export interface IProductRepository {
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product>;
    getById(id: string): Promise<Product>;
    findAll(args: PaginateArgs): Promise<Paginate<Product>>;
}

import { Product } from './product.entity';
import { Paginate, PaginateArgs } from '@core/domain';

export interface FindAllInput extends PaginateArgs {
    name?: string;
    category?: string;
}

export interface IProductRepository {
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product>;
    getById(id: string): Promise<Product>;
    findAll(input: FindAllInput): Promise<Paginate<Product>>;
}

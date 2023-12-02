import { Product } from "./product.entity";

export interface IProductRepository {
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product>;
}

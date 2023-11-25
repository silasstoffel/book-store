import { Product } from "./product.entity";

export interface IProductRepository {
    create(product: Product): Promise<Product>;
}

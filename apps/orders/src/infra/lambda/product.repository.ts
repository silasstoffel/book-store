import { SDK } from "@packages/sdk";
import { IProductRepository, Product } from "../../domain/product.repository";


export class ProductRepository implements IProductRepository {
    constructor(private readonly sdk: SDK) {}

    async findById(id: string): Promise<Product> {
        const product = await this.sdk.products.getById<Product>(id);
        return new Product(product);
    }
}


export interface IProductRepository {
    findById(id: string): Promise<Product>;
}

export interface ProductSchema {
    id: string;
    name: string;
    price: number;
    quantity: number;
    active: boolean;
}

export class Product {

    public readonly id!: string;
    public readonly name!: string;
    public readonly price!: number;
    public readonly quantity!: number;
    public readonly active!: boolean;

    public constructor(product: ProductSchema) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.quantity = product.quantity;
        this.active = product.active;
    }
}

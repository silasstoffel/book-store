import { ProductCategory } from "./enum";

export interface ProductSchema {
    id?: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category?: ProductCategory;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Product {

    public readonly id?: string;
    public readonly name!: string;
    public readonly description!: string;
    public readonly price!: number;
    public readonly quantity!: number;
    public readonly category?: ProductCategory;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;

    public constructor(product: ProductSchema) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.quantity = product.quantity;
        this.category = product.category;
        this.createdAt = !product.createdAt && !this.id ? new Date() : product.createdAt;
        this.updatedAt = !product.updatedAt && !this.id ? new Date() : product.updatedAt;
    }
}

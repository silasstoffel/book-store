import { ProductCategory } from "../../domain/enum";

export interface UpdateProductInput {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    category?: ProductCategory | null;
    active?: boolean;
}

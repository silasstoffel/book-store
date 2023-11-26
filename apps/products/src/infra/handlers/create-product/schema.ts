import { z } from "zod";
import { ProductCategory } from "../../../domain/enum";

export const createProductSchema = z.object({
    name: z.string().min(1).max(80).trim(),
    description: z.string().min(0).max(255).trim(),
    price: z.number().min(0).positive(),
    quantity: z.number().gte(0.01).positive(),
    category: z.nativeEnum(ProductCategory).optional()
})

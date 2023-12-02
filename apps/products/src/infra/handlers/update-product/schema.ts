import { z } from "zod";
import { ProductCategory } from "../../../domain/enum";

export const updateProductSchema = z.object({
    name: z.string().min(1).max(80).trim().optional(),
    description: z.string().min(0).max(255).trim().optional(),
    price: z.number().min(0).positive().optional(),
    quantity: z.number().gte(0.01).positive().optional(),
    category: z.nativeEnum(ProductCategory).optional()
})

export const pathUpdateProductSchema = z.object({
    product: z.string().min(1).max(80).trim(),
})


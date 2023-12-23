import { z } from "zod";

export const createOrderSchema = z.object({
    name: z.string().min(1).max(80).trim(),
    description: z.string().min(0).max(255).trim(),
    price: z.number().min(0).positive(),
    quantity: z.number().gte(0.01).positive(),
    active: z.boolean().optional().default(true)
})
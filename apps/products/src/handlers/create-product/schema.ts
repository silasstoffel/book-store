import { z } from "zod";

const tagSchema = z.object({
    key: z.string().min(1).max(65).trim(),
    value: z.string().min(1).max(65).trim(),
})

export const createProductSchema = z.object({
    name: z.string().min(1).max(80).trim(),
    description: z.string().min(0).max(255).trim(),
    price: z.number().gte(0.01).positive(),
    tags: z.array(tagSchema).default(undefined).nullable().optional(),
})

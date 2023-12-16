import { z } from "zod";

export const queryStringListProductSchema = z.object({
    name: z.string().min(1).trim().optional(),
    category: z.string().trim().optional(),
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
})

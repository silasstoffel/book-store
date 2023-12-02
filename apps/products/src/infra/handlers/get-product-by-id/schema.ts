import { z } from "zod";

export const pathGetProductSchema = z.object({
    product: z.string().min(1).max(80).trim(),
})

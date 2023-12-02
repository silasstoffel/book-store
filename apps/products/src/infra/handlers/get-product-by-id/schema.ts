import { z } from "zod";

export const pathGetProductSchema = z.object({
    product: z.string().min(26).max(26).trim(),
})

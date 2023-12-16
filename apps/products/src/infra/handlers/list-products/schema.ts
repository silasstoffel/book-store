import { z } from "zod";

// https://github.com/colinhacks/zod/discussions/330#discussioncomment-5833082
export const queryStringListProductSchema = z.object({
    name: z.string().min(1).trim().optional().default(undefined),
    category: z.string().trim().optional().default(undefined),
    page: z.preprocess((v) => Number(v), z.number().min(1)).optional().default(10),
    limit: z.preprocess((v) => Number(v), z.number().min(1).max(100)).optional().default(10)
})

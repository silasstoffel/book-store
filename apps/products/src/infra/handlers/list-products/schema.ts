import { z } from "zod";

// https://github.com/colinhacks/zod/discussions/330#discussioncomment-5833082
export const queryStringListProductSchema = z.object({
    name: z.string().min(1).trim().optional().default(undefined),
    category: z.string().trim().optional().default(undefined),
    startingAfter: z.string().trim().optional().default(undefined),
    endingBefore: z.string().trim().optional().default(undefined),
})

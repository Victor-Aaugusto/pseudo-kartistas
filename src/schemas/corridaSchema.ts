import zod, { z } from "zod";

export const createCorridaSchema = z.object({
    name: z.string(),
    campeonatoId: z.coerce.number().int().min(1),
    pilotos: z.array(z.coerce.number().int().positive()).min(1).max(10)
})

export const updateCorridaSchema = z.object({
    name: z.string().optional(),
    campeonatoId: z.int().min(1).optional(),
})

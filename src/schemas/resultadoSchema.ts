import z from "zod";

export const createResultSchema = z.object({
    corridaId: z.int(),
    userId: z.int(),
    posicao: z.coerce.number().int().min(1).max(10)
})

export const createResultManySchema = z.array(
    z.object({
    corridaId: z.coerce.number().min(1).int(),
    userId:  z.coerce.number().min(1).int(),
    posicao:  z.coerce.number().int().min(1).max(10)
    })
)

export const updatedResultManySchema = z.array(
    z.object({
    corridaId: z.int(),
    userId: z.int(),
    posicao: z.coerce.number().int().min(1).max(10)
    })
)


export const updatedResultSchema = z.object({
    posicao: z.coerce.number().int().min(1).max(10)
})
import z from "zod";

export const authSchema = z.object({
    nome: z.string(),
    email: z.string(),
    id: z.int().min(1)
})
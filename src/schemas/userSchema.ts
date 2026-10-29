import zod, { z } from "zod";

export const createUserSchema = zod.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    senha: z.string()
})

export const UpdateUserSchema = zod.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    senha: z.string().optional(),
})


export const loginUserSchema = zod.object({
    email: z.string(),
    senha: z.string()
})
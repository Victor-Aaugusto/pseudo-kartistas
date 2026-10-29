import z from "zod";

export const createCampeonatoSchema = z.object({
    name: z.string(),
})


export const updateCampeonatoSchema = z.object({
    name: z.string().optional(),
})
import { RequestHandler } from "express"
import { HttpError } from "../error/httpError"
import { prisma } from "../database"
import "dotenv/config";
import { authSchema } from "../schemas/authSchema";
const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRETKEY

export const authMiddleware: RequestHandler = async (req, res, next) => {
   
    const token = req.cookies?.token

    if (!token) throw new HttpError(401, 'Formato de token inválido!')

    let decodedCode
    try {
        decodedCode = jwt.verify(token, secretKey)
    } catch (error: any) {
        throw new HttpError(401, 'Token inválido ou expirado')
    }

    const result = authSchema.safeParse(decodedCode)

    if (!result.success) throw new HttpError(401, 'Token inválido ou parametro incorreto')

    const data = result.data

    const userDb = await prisma.user.findUnique({
        select: {
            name: true,
            email: true,
            id: true,
            role: true
        },
        where: {
            id: data.id
        }
    })

    if (!userDb) throw new HttpError(401, 'Usuario não localizado')

    req.authenticatedUser = userDb

    next()
}

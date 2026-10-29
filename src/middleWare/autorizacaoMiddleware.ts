import { RequestHandler } from "express"
import { HttpError } from "../error/httpError"


export const autorizacaoMiddleware: RequestHandler = (req, res, next) =>{
    const authenticatedUser = req.authenticatedUser

    if(!authenticatedUser) throw new HttpError(401, 'Necessário autorização')

    const data = authenticatedUser

    if(data.role !== 'admin') throw new HttpError(403, 'Apenas admin pode tomar essa ação')

    next()
}
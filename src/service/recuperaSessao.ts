
import { prisma } from "../database";
const jwt = require('jsonwebtoken')

export async function recuperaSession(token: any){
    let user = null
    const tokenSession = token

    if(token){
        try {
            const payload = jwt.verify(tokenSession, process.env.SECRETKEY) as {id: number}
            user = await prisma.user.findUnique({
                where: {
                    id: payload.id
                }, select:{
                    name: true,
                    role: true,
                    id: true
                }
            })

            return user
        } catch (error) {
            user = null
        }
    }
}
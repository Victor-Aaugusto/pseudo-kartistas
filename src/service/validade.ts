import { prisma } from "../database";

export async function campExiste (id: number){
   const camp =  await prisma.campeonato.findUnique({
    where:{
        id: id
    }
   })

   if(camp){
    return {camp}
   } else {
    return 
   }
}

export async function  corridaExist(id: number){
    const existisCorrida = await prisma.corridas.findUnique({
         where: {
            id: id,
        }
    })

    if(existisCorrida) {
        return {existisCorrida}
    } else {
        return false
    }
}


export async function corridaDuplicate (data: any, corridaId: number){
    const existDuplicade = data.every((user: { corridaId: number; }) => {
        if(user.corridaId !== Number(corridaId)){
            return false
        } else {
            return true
        }
    })

    return existDuplicade
}
import type { Prisma } from "../../generated/prisma/client"

export function calculaPontos (posicao: number):number {
    const tabela: Record<number, number> ={
        1: 10,
        2: 8,
        3: 5,
        4: 3,
        5: 1
    }

    return tabela[posicao] ?? 0
}

export function ordenaRanking (campeonato: CampeonatoRanking) {
const array = campeonato.CorridaList.flatMap(list => list.resultadoCorridas)

    type classificacaoTipo = {
        userId: number,
        pontos: number,
        name: string
    }

    const classificacao = array?.reduce<Record<number, classificacaoTipo>>(
        (acc, resultado) =>{
          const id = resultado.userId
            if(!acc[id]){
                acc[id] = {
                    userId: id,
                    name: resultado.user.name,
                    pontos: resultado.pontos
            }
           } else{
            acc[id].pontos += resultado.pontos
            }
            return acc
        }, {}
    )

    return Object.values(classificacao ?? {}).sort((a, b) => {
            return b.pontos - a.pontos
        })
}

type CampeonatoRanking = Prisma.CampeonatoGetPayload<{
   include: {
    CorridaList: {
        include:{
            resultadoCorridas: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    }
   }
}>;
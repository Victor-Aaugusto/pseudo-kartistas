import { Handler } from "express";
import { prisma } from "../database";
import { createResultManySchema, createResultSchema, updatedResultManySchema, updatedResultSchema } from "../schemas/resultadoSchema";
import { HttpError } from "../error/httpError";
import { calculaPontos } from "../service/pontuacao";
import { campExiste, corridaDuplicate, corridaExist } from "../service/validade";
import { id } from "zod/locales";
import { number } from "zod";


export class ControlerResultado {
    index: Handler = async(req, res, next) => {
        try {
            const resultadoCorrida = await prisma.resultadoCorrida.findMany()
            res.status(200).json({data: resultadoCorrida})
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async(req, res, next) => {
        try {
            const data = createResultSchema.parse(req.body)
            const points = calculaPontos(data.posicao)

            const newResult = await prisma.resultadoCorrida.create({
                data: {...data, pontos: points}
            })

            res.status(201).json({data: newResult})
        } catch (error) {
            next(error)
        }
    }

    createMany: Handler = async (req, res, next) =>{
        const data = createResultManySchema.parse(req.body)

        if(!data) throw new HttpError(404, 'Resultados não encontrados')

        const existisCorrida = await prisma.corridas.findFirst({
            where: {
                id: Number(req.params.corridaId),
            },
            include:{
                userId:{
                    select:{
                        id: true
                    }
                }
            }
        })
        
        data.every(user => {
            if(user.corridaId !== Number(req.params.corridaId)){
                throw new HttpError(400, 'Dados inconsistentes!')
            } else {
                return true
            }
        })

        if(!existisCorrida) throw new HttpError(404, 'Corrida não encontrada')

        const existisCamp = await prisma.campeonato.findFirst({
            where: {
                id: Number(req.params.campeonatoId)
            }
        })

        const existisCampECorddia = existisCorrida?.campeonatoId === existisCamp?.id

        if(!existisCampECorddia) throw new HttpError(404, 'Campeonato não encontrado')
        
        const pilotosAssociados = data.some(user => !existisCorrida.userId.some(piloto => piloto.id === user.userId))

        if(pilotosAssociados) throw new HttpError(404, 'Piloto não associado enviado!')

        const idsList = data.map(id => {
            return id.userId
        })

        const posicaoList = data.map(posicao => {
            return posicao.posicao
        })

        const idRepeat = new Set(idsList).size !== idsList.length
        const posicaoRepeat = new Set(posicaoList).size !== posicaoList.length

        if(idRepeat) throw new HttpError(400, 'Ids repetidos enviados')
        if(posicaoRepeat) throw new HttpError(400, 'Posições repetidos enviados')

        const resultado = data.map(user =>( {
            ...user,
            pontos: calculaPontos(user.posicao)
            })
        )

        const newResults = await prisma.resultadoCorrida.createManyAndReturn({
            data: resultado
        })

        res.status(201).json({data: newResults})
    }

    createManyShow: Handler = async (req, res, next) =>{
        const data = createResultManySchema.parse(req.body.resultados)

        if(!data) throw new HttpError(404, 'Resultados não encontrados')

        const existisCorrida = await prisma.corridas.findFirst({
            where: {
                id: Number(req.params.corridaId),
            }, include:{
                userId:{
                    select:{
                        id: true
                    }
                }
            }
        })
        
        data.every(user => {
            if(user.corridaId !== Number(req.params.corridaId)){
                throw new HttpError(400, 'Dados inconsistentes!')
            } else {
                return true
            }
        })

        if(!existisCorrida) throw new HttpError(404, 'Corrida não encontrada')

        const existisCamp = await prisma.campeonato.findFirst({
            where: {
                id: Number(req.params.campeonatoId)
            }
        })

        const existisCampECorddia = existisCorrida?.campeonatoId === existisCamp?.id

        if(existisCampECorddia) throw new HttpError(404, 'Campeonato não encontrado')

        const pilotosAssociados = data.some(user => !existisCorrida.userId.some(piloto => piloto.id === user.userId))

        if(!pilotosAssociados) throw new HttpError(404, 'Piloto não associado enviado!')

        const resultado = data.map(user =>( {
            ...user,
            pontos: calculaPontos(user.posicao)
            })
        )

        await prisma.resultadoCorrida.createManyAndReturn({
            data: resultado
        })

        return res.redirect(
    `/campeonato/${req.params.campeonatoId}/corrida/${req.params.corridaId}`
)
    }

    show: Handler = async(req, res, next) => {
        try {
            const resultado = await prisma.resultadoCorrida.findUnique({
                where:{
                    corridaId_userId: {
                        userId: Number(req.params.userId),
                        corridaId: Number(req.params.corridaId)
                    }
                }
            })

             if(!resultado) throw new HttpError(404, 'Não localizado')

            res.status(200).json({data: resultado})
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async(req, res, next) => {
        try {
            const resultadoExists = await prisma.resultadoCorrida.findUnique({
                where: {
                corridaId_userId: {
                    corridaId: Number(req.params.corridaId),
                    userId: Number(req.params.userId)
                }
            }
        })


            if(!resultadoExists) throw new HttpError(404, 'Não localizado')

            const data = updatedResultSchema.parse(req.body)


            const points = data.posicao ?? resultadoExists.posicao

            const updatedPoints = calculaPontos(points)


            const updatedResultado = await prisma.resultadoCorrida.update({
                data: {...data, pontos: updatedPoints},
                where:{
                    corridaId_userId: {
                        userId: Number(req.params.userId),
                        corridaId: Number(req.params.corridaId)
                    }
                }
            })

            res.status(200).json({data: updatedResultado})
        } catch (error) {
            next(error)
        }
    }


    updateManyJson: Handler = async(req, res, next) =>{
        try{
        const data = updatedResultManySchema.parse(req.body)

        if(!data) throw new HttpError(404, 'Resultados não encontrados')

        const existisCorrida = await corridaExist(Number(req.params.corridaId))
        
        if(!existisCorrida) throw new HttpError(404, 'Corrida não encontrada')

        const corridaDuplicat = await corridaDuplicate(data, Number(req.params.corridaId))

        if(!corridaDuplicat) throw new HttpError(404, 'Parametros incorretos')

        const existisCamp = await campExiste(Number(req.params.campeonatoId))

        const existisCampECorddia = existisCamp?.camp.id === existisCorrida.existisCorrida.campeonatoId

        if(!existisCampECorddia) throw new HttpError(404, 'Campeonato não encontrado')

        const dadosSeparadosId = data.flatMap(dados => dados.userId)
        const dadosSeparadosPosicao = data.flatMap(dados => dados.posicao)
        const idRepeat = new Set(dadosSeparadosId).size !== dadosSeparadosId.length
        const posicaoRepeat = new Set(dadosSeparadosPosicao).size !== dadosSeparadosPosicao.length

        if(idRepeat || posicaoRepeat) throw new HttpError(400, 'requisição contém pilotos/posições duplicados')


        const resultado = data.map(result =>( {
            ...result,
            pontos: calculaPontos(result.posicao)
        
        }))


        const newResult = await prisma.$transaction(async (tx) =>{
            for (const user of resultado){
              
              await  tx.resultadoCorrida.update({
                    where:{
                        corridaId_userId:{
                            userId: user.userId,
                            corridaId: user.corridaId
                        }
                    },
                    data: {
                        posicao: user.posicao + 10,
                        pontos: 0
                    }
                })
                
            }

            let resultadoFinal:any = []

             for (const user of resultado){
              
             const result = await  tx.resultadoCorrida.update({
                    where:{
                        corridaId_userId:{
                            userId: user.userId,
                            corridaId: user.corridaId
                        }
                    },
                    data: {
                        posicao: user.posicao,
                        pontos: user.pontos
                    }
                })
                resultadoFinal.push(result)
                
            }
            return resultadoFinal
        }

    )

        res.status(201).json({data: newResult})
    } catch(error){
        next(error)
    }
    }

    updateMany: Handler = async(req, res, next) =>{
        try{
        const data = updatedResultManySchema.parse(req.body)

        if(!data) throw new HttpError(404, 'Resultados não encontrados')

        const existisCorrida = await corridaExist(Number(req.params.corridaId))
        
        if(!existisCorrida) throw new HttpError(404, 'Corrida não encontrada')

        const corridaDuplicat = await corridaDuplicate(data, Number(req.params.corridaId))

        if(!corridaDuplicat) throw new HttpError(404, 'Parametros incorretos')

        const existisCamp = await campExiste(Number(req.params.campeonatoId))

        const existisCampECorddia = existisCamp?.camp.id === existisCorrida.existisCorrida.campeonatoId

        if(!existisCampECorddia) throw new HttpError(404, 'Campeonato não encontrado')

        const dadosSeparadosId = data.flatMap(dados => dados.userId)
        const dadosSeparadosPosicao = data.flatMap(dados => dados.posicao)
        const idRepeat = new Set(dadosSeparadosId).size !== dadosSeparadosId.length
        const posicaoRepeat = new Set(dadosSeparadosPosicao).size !== dadosSeparadosPosicao.length

        if(idRepeat || posicaoRepeat) throw new HttpError(400, 'requisição contém pilotos/posições duplicados')


        const resultado = data.map(result =>( {
            ...result,
            pontos: calculaPontos(result.posicao)
        
        }))


        const newResult = await prisma.$transaction(async (tx) =>{
            for (const user of resultado){
              
              await  tx.resultadoCorrida.update({
                    where:{
                        corridaId_userId:{
                            userId: user.userId,
                            corridaId: user.corridaId
                        }
                    },
                    data: {
                        posicao: user.posicao + 10,
                        pontos: 0
                    }
                })
                
            }

            let resultadoFinal:any = []

             for (const user of resultado){
              
             const result = await  tx.resultadoCorrida.update({
                    where:{
                        corridaId_userId:{
                            userId: user.userId,
                            corridaId: user.corridaId
                        }
                    },
                    data: {
                        posicao: user.posicao,
                        pontos: user.pontos
                    }
                })
                resultadoFinal.push(result)
                
            }
            return resultadoFinal
        }

    )

        res.status(201).render("corridas", {data: newResult})
    } catch(error){
        next(error)
    }
    }

    delete: Handler = async(req, res, next) => {
        try {
            const resultadoExists = await prisma.resultadoCorrida.findUnique({
                where: {
                    corridaId_userId: {
                        userId: Number(req.params.userId),
                        corridaId: Number(req.params.corridaId)
                    }
                }
            })

            if(!resultadoExists) throw new HttpError(404, 'Não localizado')

            await prisma.resultadoCorrida.delete({
                where: {
                  corridaId_userId: {
                        userId: Number(req.params.userId),
                        corridaId: Number(req.params.corridaId)
                    }
                }
            })

            res.status(200).json({message: "Resultado deletado com sucesso"})
        } catch (error) {
            next(error)
        }
    }
}

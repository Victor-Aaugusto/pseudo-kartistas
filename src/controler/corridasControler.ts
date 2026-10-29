import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../error/httpError";
import { createCorridaSchema, updateCorridaSchema } from "../schemas/corridaSchema";

export class ControlerCorridas {
    index: Handler = async (req, res, next) => {
        try {
            const corridas = await prisma.corridas.findMany({
                include:{
                    userId: {
                        select: {
                            name: true
                        }
                    },
                    campeonato: true
                }
            })

            res.status(200).json({data: corridas})
        } catch (error) {
            next(error)
        }
    }


    indexPage:  Handler = async (req, res, next) => {
        try {
            const corridas = await prisma.corridas.findMany({
                include:{
                    userId: {
                        select: {
                            name: true
                        }
                    },
                    campeonato: true
                }
            })

            res.status(200).render("corridas",{data: corridas})
        } catch (error) {
            next(error)
        }
    }


    create: Handler = async (req, res, next) =>{
       try {
        const {pilotos, ...dadosCorrida} = createCorridaSchema.parse(req.body)

        const corridaExist = await prisma.campeonato.findUnique({
            where: {id: dadosCorrida.campeonatoId}
        })

        if(!corridaExist) throw new HttpError(404,'Camepeonato não existe')

        const pilotosRepetidosList = new Set(pilotos).size 

        const pilotosRepetidos = pilotos.length !== pilotosRepetidosList

        if(pilotosRepetidos) throw new HttpError(400, 'Pilotos repetidos informados')

        const piltosExistentes = await prisma.user.findMany({
            where:{
                id: {in: pilotos}
            }, select:{
                id: true
            }
        })

        if(piltosExistentes.length !== new Set(pilotos).size){
            throw new HttpError(400, 'Um ou mais pilotos não localizados')
        }

        await prisma.corridas.create({
            data: {
                ...dadosCorrida,
                userId:{
                    connect: pilotos.map((id) => ({id}))
                }
            }
        })

        return res.status(201).redirect(303, '/corridas')
       } catch (error) {
            next(error)
       }
    }

    createJson: Handler = async (req, res, next) => {
        try {
            const { pilotos, ...dadosCorrida } = createCorridaSchema.parse(req.body)

            const corridaExist = await prisma.campeonato.findUnique({
            where: {id: dadosCorrida.campeonatoId}
        })

        if(!corridaExist) throw new HttpError(404,'Camepeonato não existe')

        const pilotosRepetidosList = new Set(pilotos).size 

        const pilotosRepetidos = pilotos.length !== pilotosRepetidosList

        if(pilotosRepetidos) throw new HttpError(400, 'Pilotos repetidos informados')

        const piltosExistentes = await prisma.user.findMany({
            where:{
                id: {in: pilotos}
            }, select:{
                id: true
            }
        })

        if(piltosExistentes.length !== new Set(pilotos).size){
            throw new HttpError(400, 'Um ou mais pilotos não localizados')
        }

        const corrida = await prisma.corridas.create({
            data: {
                ...dadosCorrida,
                userId: { connect: pilotos.map((id) => ({ id })) }
            },
             include: { campeonato: true, userId: { select: { id: true, name: true } } }
            })
            res.status(201).json({ data: corrida })
        } catch (error) {
            next(error)
        }
    }
    
    corridaNovaPage: Handler = async (req, res, next) =>{
        try{
            
        const corridas = await prisma.campeonato.findMany({
            select: {
                name: true,
                id: true,
            }
        })

        const users = await prisma.user.findMany({
            select:{
                name: true,
                id: true
            }
        })

        res.status(200).render('corrida-nova', {data: {campeonatos: corridas, users}})

        }catch(error){
            throw new HttpError(400, 'Erro ao criari corrida')
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const corrida = await prisma.corridas.findUnique({
                where: {
                    id: Number(req.params.id),
                },
                include: {
                    campeonato: true,
                    resultadoCorridas: true
                }
            })

            if(!corrida) throw new HttpError(404,'usuario não localizado')
            res.status(200).render("corrida",{data: corrida})
        } catch (error) {
            next(error)
        }
    }

    showJson: Handler = async (req, res, next) => {
        try {
            const corrida = await prisma.corridas.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    campeonato: true,
                    userId: { select: { id: true, name: true } },
                    resultadoCorridas: { include: { user: { select: { id: true, name: true } } } }
                }
            })
            if (!corrida) throw new HttpError(404, 'Corrida não localizada')
            res.status(200).json({ data: corrida })
        } catch (error) {
            next(error)
        }
    }

    showPage: Handler = async (req, res, next) => {
        try {
            const corrida = await prisma.corridas.findUnique({
                select:{
                    name: true,
                    id: true,
                    campeonatoId: true,
                    userId: {
                        select: {
                            name: true,
                            id: true
                        }
                    },
                    campeonato: {
                        select: {
                            name: true
                        }
                    },
                    resultadoCorridas: {
                        select: {
                            corrida: true,
                            user: {
                                select:{
                                    name: true,
                                    id: true
                                }
                            },
                            pontos: true,
                            posicao: true
                        }
                    }
                },
                where: {
                    id: Number(req.params.id),
                }
            })

            const dataShow = {corrida, users: corrida?.userId}

            if(!corrida) throw new HttpError(404,'corrida não localizado')
            res.status(200).render('corrida',{data: dataShow})
        } catch (error) {
            next(error)
        }
    }

    showPageEditar: Handler = async (req, res, next) => {
        try {
            const corrida = await prisma.corridas.findUnique({
                select:{
                    name: true,
                    id: true,
                    campeonatoId: true,
                    campeonato: {
                        select: {
                            name: true
                        }
                    },
                    resultadoCorridas: {
                        select: {
                            corrida: true,
                            user: {
                                select:{
                                    name: true,
                                    id:
                                     true
                                }
                            },
                            pontos: true,
                            posicao: true
                        }
                    }
                },
                where: {
                    id: Number(req.params.id),
                }
            })

            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true
                }
            })

            const dataShow = {corrida: corrida, users: users}

            if(!corrida) throw new HttpError(404,'corrida não localizado')
            res.status(200).render('corrida-editar',{data: dataShow})
        } catch (error) {
            next(error)
        }
    }


    update: Handler = async (req, res, next) => {
        try {
            const data = updateCorridaSchema.parse(req.body)

            const id = Number(req.params.id)

            if(!Number.isInteger(id) || id < 1) throw new HttpError(404, 'Id corrida não localizado')

            const corridaExist = await prisma.corridas.findUnique({
                where: {id: id}
           })

            if(!corridaExist) throw new HttpError(404,' Corrida não localizado')
                
            if(data.campeonatoId !== undefined){
                 const campeonato = await prisma.campeonato.findUnique({
                where: { id: data.campeonatoId }
            })

            if (!campeonato) {
                throw new HttpError(404, 'Campeonato não encontrado');
            }
        }
            const updatedCorrida = await prisma.corridas.update({
                where: {
                    id: Number(req.params.id)
                },
                data: data
            })

            res.status(200).json({data: updatedCorrida})
        } catch (error) {
            next(error)
        }
    }


    deleteJson: Handler = async (req, res, next) => {
        try {
           const corridaExist = await prisma.corridas.findUnique({
            where: {
                id: Number(req.params.id)
            }
           })

           if(!corridaExist) throw new HttpError(404,'usuario não localizado')

            await prisma.corridas.delete({
                where: {
                    id: Number(req.params.id)
                }
            })

            res.status(200).json({message: "Corrida deletado com suceso!"})
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
           const corridaExist = await prisma.corridas.findUnique({
            where: {
                id: Number(req.params.id)
            }
           })

           if(!corridaExist) throw new HttpError(404,'usuario não localizado')

            await prisma.corridas.delete({
                where: {
                    id: Number(req.params.id)
                }
            })

            const corridas = await prisma.corridas.findMany({
                include:{
                    userId: {
                        select: {
                            name: true
                        }
                    },
                    campeonato: true
                }
            })

            res.status(200).render("corridas", {data: corridas})
        } catch (error) {
            next(error)
        }
    }
}

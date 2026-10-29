import { Handler } from "express";
import { prisma } from "../database";
import { createCampeonatoSchema, updateCampeonatoSchema } from "../schemas/cmapeonatoSchema";
import { HttpError } from "../error/httpError";
import { ordenaRanking } from "../service/pontuacao";
import { recuperaSession } from "../service/recuperaSessao";

export class ControlerCampeonato {
    home: Handler = async (_req, res, next) => {
        try {
            const campeonatos = await prisma.campeonato.findMany({
                include: {CorridaList: true, 
                _count: { select: { CorridaList: true } } },
                orderBy: { id: "desc" }
            })

            res.render("home", { campeonatos })
        } catch (error) {
            next(error)
        }
    }

    campeonatosPage: Handler = async (_req, res, next) => {
        try {
            const campeonatos = await prisma.campeonato.findMany({
                include: { _count: { select: { CorridaList: true } } },
                orderBy: { id: "desc" }
            })

            res.render("campeonatos", { campeonatos })
        } catch (error) {
            next(error)
        }
    }

    classificacao: Handler = async (_req, res, next) => {
        try {
            const campeonatos = await prisma.campeonato.findMany({
                orderBy: { id: "desc" }
            })

            res.render("classificacao", {
                campeonatos,
                campeonatoSelecionado: null,
                ranking: []
            })
        } catch (error) {
            next(error)
        }
    }

    classificacaoPorCampeonato: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            if (!Number.isInteger(id) || id < 1) {
                throw new HttpError(400, "ID de campeonato inválido")
            }

            const [campeonatos, campeonato] = await Promise.all([
                prisma.campeonato.findMany({ orderBy: { id: "desc" } }),
                prisma.campeonato.findUnique({
                    where: { id },
                    include: {
                        CorridaList: {
                            include: {
                                resultadoCorridas: {
                                    include: {
                                        user: { select: { name: true} }
                                    }
                                }
                            }
                        }
                    }
                })
            ])

            if (!campeonato) throw new HttpError(404, "Campeonato não localizado")

            const ranking = ordenaRanking(campeonato)
            res.render("classificacao", { campeonatos, campeonatoSelecionado: campeonato, ranking })
        } catch (error) {
            next(error)
        }
    }

    index: Handler = async (req, res, next) =>{
        try {
        const campeonatos = await prisma.campeonato.findMany()
        res.status(200).json({
            data: campeonatos
        })
        } catch (error) {
            next(error)
        }
    }

    createJson: Handler = async (req, res, next) =>{
        try {
        const userId = req.authenticatedUser?.id
        
        if(!userId) throw new HttpError(401, 'Usuário nãoa autenticado')

        const data = createCampeonatoSchema.parse(req.body) 

        const newCampeonato = await prisma.campeonato.create({
            data: {...data, userCamp:{connect: {id: userId}}}
        })

        if(!newCampeonato) throw new HttpError(400, 'Erro ao criar usuário')

        res.status(201).json({data: newCampeonato})
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) =>{
        try {

        const userId = req.authenticatedUser?.id
        
        if(!userId) throw new HttpError(401, 'Usuário nãoa autenticado')

        const data = createCampeonatoSchema.parse(req.body) 

        const newCampeonato = await prisma.campeonato.create({
            data: {...data, userCamp:{connect: {id: userId}}}
        })

        if(!newCampeonato) throw new HttpError(400, 'Erro ao criar usuário')

        res.status(201).redirect("/campeonatos")
        } catch (error) {
            next(error)
        }
    }

    showJson: Handler = async (req, res, next) =>{
        try {
            const campeonato = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                CorridaList: true,
                userCamp: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        })
        res.status(200).json({data: campeonato})
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) =>{
        try {
            const campeonato = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                CorridaList: true,
                userCamp: {
                    select: {
                        name: true,
                        email: true,
                    }, 
                }, 
            }
        })

        const sessao = await recuperaSession(req.cookies?.token)

        if(!sessao) throw new HttpError(404, 'token não localizado')

        const user = await prisma.user.findUnique({
            where: {
                id: sessao.id
            },
            select:{
                name: true,
                role: true,
                id: true
            }
        })
        res.status(200).render("campeonato-detalhe", {data: campeonato, user})
        } catch (error) {
            next(error)
        }
    }

    showEditar: Handler = async (req, res, next) =>{
        try {
            const campeonato = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                CorridaList: true,
                userCamp: {
                    select: {
                        name: true,
                        email: true,
                    }, 
                }, 
            }
        })

        const sessao = await recuperaSession(req.cookies?.token)

        if(!sessao) throw new HttpError(404, 'token não localizado')

        res.status(200).render("campeonato-editar", {data: campeonato})
        } catch (error) {
            next(error)
        }
    }

    ranking: Handler = async (req, res, next) =>{
        try {
            const campeonato = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                CorridaList: {
                   include:{
                    resultadoCorridas: {
                        include:{
                            user:{
                                select: {
                                name: true,
                                email: true
                            }
                        }
                        }
                    }                    
                   }
                }
            }
        })

        if(!campeonato) throw new HttpError(404, 'Campeonato não localizado')

        const ranking = ordenaRanking(campeonato)

        res.status(200).json({data: ranking})
        } catch (error) {
            next(error)
        }
}

    updateJson: Handler = async (req, res, next) =>{
        try {
            const campeonatoExistis = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            }
          })

          if(!campeonatoExistis) throw new HttpError(404, 'Campeonato não existe')

          const data = updateCampeonatoSchema.parse(req.body) 
          const updatedCampeonato = await prisma.campeonato.update({
            data: data,
            where: {
                id: Number(req.params.id)
            }
          })

          res.status(200).json({data:updatedCampeonato})
        } catch (error) {
            next(error)
        }
    }


    update: Handler = async (req, res, next) =>{
        try {
            const campeonatoExistis = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            }
          })

          if(!campeonatoExistis) throw new HttpError(404, 'Campeonato não existe')

          const data = updateCampeonatoSchema.parse(req.body) 
          const updatedCampeonato = await prisma.campeonato.update({
            data: data,
            where: {
                id: Number(req.params.id)
            }
          })

          res.status(200).render('campeonatos', {data: updatedCampeonato
          })
        } catch (error) {
            next(error)
        }
    }


    deleteJson: Handler = async (req, res, next) =>{
        try {
          const campeonatoExistis = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            }
          })

          if(!campeonatoExistis) throw new HttpError(404, 'Campeonato não existe')

          await prisma.campeonato.deleteMany({
            where: {
                id: Number(req.params.id)
            }
          })

          res.status(200).json({message: 'Campeonato excluido com sucesso!'})
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) =>{
        try {
          const campeonatoExistis = await prisma.campeonato.findUnique({
            where: {
                id: Number(req.params.id)
            }
          })

          if(!campeonatoExistis) throw new HttpError(404, 'Campeonato não existe')

          await prisma.campeonato.deleteMany({
            where: {
                id: Number(req.params.id)
            }
          })

        const campeonatos = await prisma.campeonato.findMany({
            include: { _count: { select: { CorridaList: true } } },
               orderBy: { id: "desc" }
            })


          res.status(200).render("campeonatos", {data: campeonatos})
        } catch (error) {
            next(error)
        }
    }



}




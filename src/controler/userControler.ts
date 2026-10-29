import { Handler } from "express";
import { prisma } from "../database";
import { createUserSchema, loginUserSchema, UpdateUserSchema } from "../schemas/userSchema";
import { HttpError } from "../error/httpError";
import { number } from "zod";

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
export class ControlerUser {

    login: Handler = async (req, res, next) =>{
        try {
            const data = loginUserSchema.parse(req.body)
             const user = await prisma.user.findUnique({
                
                where: {
                email: data.email
            }
        })  
        if(!user) throw new HttpError(404, 'Usuario não localizado')

        const validSenha = await bcrypt.compare(data.senha, user.senha)

        if(!validSenha) throw new HttpError(401, 'Senha inválida')  
            
        const payload = {email: user.email, nome: user.name, id: user.id}
        const assinatura = jwt.sign(payload, process.env.SECRETKEY, {expiresIn: '1h'})

        const campeonatosList = await prisma.campeonato.findMany({
            select: {
                name: true,
                id: true,
                CorridaList: {
                    select:{
                        id: true,
                        name: true,
                        campeonatoId: true
                    }
                }, _count: {
                    select: {CorridaList: true}
                }
            },
            orderBy:{id: 'desc'}
        })

        res.cookie('token', assinatura, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/'
        })
        res.render("home",{campeonatos: campeonatosList, user: payload})
        } catch (error) {
            next(error)
        }
    } 

    loginJson: Handler = async (req, res, next) => {
        try {
            const data = loginUserSchema.parse(req.body)
            const user = await prisma.user.findUnique({ where: { email: data.email } })

            if (!user) throw new HttpError(404, 'Usuario não localizado')
            if (!await bcrypt.compare(data.senha, user.senha)) {
                throw new HttpError(401, 'Senha inválida')
            }

            const payload = { email: user.email, nome: user.name, id: user.id }
            const assinatura = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '1h' })

            res.cookie('token', assinatura, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 1000,
                path: '/'
            })

            res.status(200).json({ data: payload })
        } catch (error) {
            next(error)
        }
    }

    indexJson: Handler = async (req, res, next) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    name: true,
                    email: true
                }
            })  

            res.status(200).json({data: users})
        } catch (error) {
            next(error)
        }
    }

    index: Handler = async (req, res, next) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    name: true,
                    id: true,
                    resultadoCorridas: {
                        select: {
                            posicao: true
                        }
                    },
                    _count: {
                        select: {corridas: true}
                    }
                }, orderBy: {id: 'desc'}
            })  

            res.status(200).render("usuarios",{data: users})
        } catch (error) {
            next(error)
        }
    }

    createJson: Handler = async (req, res, next) =>{
       try {
        const data = createUserSchema.parse(req.body)

        const pass = await bcrypt.hash(data.senha, 10)

        const User ={...data, senha: pass}

        const newUser = await prisma.user.create({
            data: User
        })

        if(!User) throw new HttpError(400,'Falha ao criar usuário')


        const payload = {name: newUser.name, email: newUser.email}

        res.status(201).json({data: payload})
       } catch (error) {
            next(error)
       }

    }

    create: Handler = async (req, res, next) =>{
       try {
        const data = createUserSchema.parse(req.body)

        const pass = await bcrypt.hash(data.senha, 10)

        const User ={...data, senha: pass}

        const newUser = await prisma.user.create({
            data: User
        })

        if(!User) throw new HttpError(400,'Falha ao criar usuário')

        const payload = {
            id: newUser.id,
            nome: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role
        }

        const assinatura = jwt.sign(payload, process.env.SECRETKEY, {expiresIn: '1h'})

         res.cookie('token', assinatura, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/'
        })

        res.status(201).render("perfil", {user: payload})
       } catch (error) {
            next(error)
       }

    }

    show: Handler = async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(req.params.id),
                },
                select: {
                    name: true,
                    email: true,
                }
            })

            if(!user) throw new HttpError(404,'usuario não localizado')

            const payload = {name: user.name, email: user.email}

            res.status(200).json({data: payload})
        } catch (error) {
            next(error)
        }
    }

    showPage: Handler = async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(req.params.id) },
                select: { id: true, name: true, email: true, phone: true, role: true }
            })
            if (!user) throw new HttpError(404, 'Usuário não localizado')
            res.status(200).render('usuario', { user })
        } catch (error) {
            next(error)
        }
    }

    showEditPage: Handler = async (req, res, next) => {
        try {
            const authenticatedUser = req.authenticatedUser
            const userId = Number(req.params.id)
            if (!authenticatedUser) throw new HttpError(401, 'Usuário não autenticado')
            if (authenticatedUser.id !== userId && authenticatedUser.role !== 'admin') {
                throw new HttpError(403, 'Sem permissão para editar este usuário')
            }

            const usuario = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, email: true, phone: true }
            })
            if (!usuario) throw new HttpError(404, 'Usuário não localizado')
            res.status(200).render('usuario-editar', { usuario })
        } catch (error) {
            next(error)
        }
    }

    showPerfil: Handler = async (req, res, next) => {

        try {
            const userId = req.authenticatedUser?.id  
            
            if(!userId) throw new HttpError(404, 'Erro ao localizar sessão')

            const dataUser = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    name: true,
                    email: true,
                    phone: true,
                    corridas:{
                        select:{
                            id: true,
                            campeonatoId: true
                            }
                        }, resultadoCorridas:{
                            select:{
                                corridaId: true,
                                pontos: true,
                                posicao: true,
                                corrida:{
                                    select:{
                                    campeonato:{
                                    select: {id: true, name: true}
                            },
                                    }
                                }
                            }
                    }
                }
            })

            if(!dataUser) throw new HttpError(404,'usuario não localizado')

            const pontosAgrupados = new Map
            <number,
            {campeonatoId: number; campeonatoNome: string; pontos: number}>();

            for(const resultado of dataUser.resultadoCorridas){
                const campeonato = resultado.corrida.campeonato
                const atual = pontosAgrupados.get(campeonato.id)

                if(atual){
                    atual.pontos += resultado.pontos
                } else{
                    pontosAgrupados.set(campeonato.id, {
                        campeonatoId: campeonato.id,
                        campeonatoNome: campeonato.name,
                        pontos: resultado.pontos
                    })
                }
            }

            const dashboard = {
                totalCampeonatos: new Set(
                    dataUser.corridas.map(corrida => corrida.campeonatoId)
                ).size,
                totalCorridas: dataUser.corridas.length,
                podios:{
                    p1: dataUser.resultadoCorridas.filter(result => result.posicao === 1).length,
                    p2: dataUser.resultadoCorridas.filter(result => result.posicao === 2).length,
                    p3: dataUser.resultadoCorridas.filter(result => result.posicao === 3).length
                },
                pontosPorCampeonato: Array.from(pontosAgrupados.values())
                .sort((a, b) => b.pontos - a.pontos)
            }

            const payload = {id: userId, name: dataUser.name, email: dataUser.email, phone: dataUser.phone}

            res.status(200).render("perfil", {user: payload, dashboard})
        } catch (error) {
            next(error)
        }
    }

    showPerfilPublic: Handler = async (req, res, next) => {

        try {
            const userId = Number(req.params.id) 
            
            if(!userId) throw new HttpError(404, 'Erro ao localizar sessão')

            const dataUser = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    name: true,
                    corridas:{
                        select:{
                            id: true,
                            campeonatoId: true
                            }
                        }, resultadoCorridas:{
                            select:{
                                corridaId: true,
                                pontos: true,
                                posicao: true,
                                corrida:{
                                    select:{
                                    campeonato:{
                                    select: {id: true, name: true}
                            },
                                    }
                                }
                            }
                    }
                }
            })

            if(!dataUser) throw new HttpError(404,'usuario não localizado')

            const pontosAgrupados = new Map
            <number,
            {campeonatoId: number; campeonatoNome: string; pontos: number}>();

            for(const resultado of dataUser.resultadoCorridas){
                const campeonato = resultado.corrida.campeonato
                const atual = pontosAgrupados.get(campeonato.id)

                if(atual){
                    atual.pontos += resultado.pontos
                } else{
                    pontosAgrupados.set(campeonato.id, {
                        campeonatoId: campeonato.id,
                        campeonatoNome: campeonato.name,
                        pontos: resultado.pontos
                    })
                }
            }

            const dashboard = {
                totalCampeonatos: new Set(
                    dataUser.corridas.map(corrida => corrida.campeonatoId)
                ).size,
                totalCorridas: dataUser.corridas.length,
                podios:{
                    p1: dataUser.resultadoCorridas.filter(result => result.posicao === 1).length,
                    p2: dataUser.resultadoCorridas.filter(result => result.posicao === 2).length,
                    p3: dataUser.resultadoCorridas.filter(result => result.posicao === 3).length
                },
                pontosPorCampeonato: Array.from(pontosAgrupados.values())
                .sort((a, b) => b.pontos - a.pontos)
            }

            const payload = {id: userId, name: dataUser.name}

            res.status(200).render("perfil", {user: payload, dashboard})
        } catch (error) {
            next(error)
        }
    }

    updateJson: Handler = async (req, res, next) => {
        try {
            const userExist = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
           })

            if(!userExist) throw new HttpError(404,'usuario não localizado')

            const data = UpdateUserSchema.parse(req.body)

            const updatedUser = await prisma.user.update({
                data: data,
                where: {
                    id: Number(req.params.id)
                }
            })

            const payload = {name: updatedUser.name, email: updatedUser.email, role: updatedUser.role}

            res.status(200).json({data: payload})
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        const data = UpdateUserSchema.parse(req.body)
        const userId = req.authenticatedUser
        let senha

        if(!userId) throw new HttpError(401, 'Usuário não autenticado')

        if(userId.id !== Number(req.params.id) && userId.role !== 'admin') throw new HttpError(403, 'Usuário não autenticado')

        try {
            const userExist = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
           })

            if(!userExist) throw new HttpError(404,'usuario não localizado')

            if(data.senha && data.senha?.length > 0){
                senha = await bcrypt.hash(data.senha, 12)
            } else{
                senha = userExist.senha 
            }

            const updatedUser = await prisma.user.update({
                data: {...data, senha: senha},
                where: {
                    id: Number(req.params.id)
                }
            })

            const payload = {name: updatedUser.name, email: updatedUser.email, role: updatedUser.role}

            res.status(200).json({data: payload})
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
           const userExist = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
           })

           if(!userExist) throw new HttpError(404,'usuario não localizado')

            await prisma.user.delete({
                where: {
                    id: Number(req.params.id)
                }
            })

            res.status(200).json({message: "Usuario deletado com suceso!"})
        } catch (error) {
            next(error)
        }
    }

    logout: Handler = async (req, res, next) =>{
       res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: '/'
       })

       res.status(200).redirect("/")
    }

    logoutJson: Handler = async (_req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })
        res.status(200).json({ message: 'Sessão encerrada' })
    }
}

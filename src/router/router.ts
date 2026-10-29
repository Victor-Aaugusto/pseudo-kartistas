import { Router } from "express";
import { ControlerUser } from "../controler/userControler";
import { ControlerCorridas } from "../controler/corridasControler";
import { ControlerCampeonato } from "../controler/campeonatoControler";
import { ControlerResultado } from "../controler/resultadoControler";
import { authMiddleware } from "../middleWare/autenticacaoMiddleware";
import { autorizacaoMiddleware } from "../middleWare/autorizacaoMiddleware";

export const router = Router()

const controlerUser = new ControlerUser()
const controlerCorridas = new ControlerCorridas()
const controlerCampeonato = new ControlerCampeonato()
const controlerResultado = new ControlerResultado()

// rotas de usuario
router.get('/users', authMiddleware, controlerUser.indexJson)
router.post('/users/login', controlerUser.loginJson)
router.post('/users', authMiddleware, autorizacaoMiddleware, controlerUser.createJson)
router.get('/users/:id', authMiddleware, autorizacaoMiddleware, controlerUser.show)
router.put('/users/:id', authMiddleware, controlerUser.update)
router.delete('/users/:id', authMiddleware, autorizacaoMiddleware, controlerUser.delete)
router.post('/logout', controlerUser.logoutJson)
// rotas de corridas
router.get('/corridas', controlerCorridas.index)
router.get('/corridas/:id', controlerCorridas.showJson)
router.post('/corridas', authMiddleware, autorizacaoMiddleware, controlerCorridas.createJson)
router.put('/corridas/:id', authMiddleware, autorizacaoMiddleware, controlerCorridas.update)
router.delete('/corridas/:id', authMiddleware, autorizacaoMiddleware, controlerCorridas.deleteJson)
// rotas campeonato
router.get('/campeonato', controlerCampeonato.index)
router.get('/campeonato/:id', controlerCampeonato.showJson)
router.get('/campeonato/:id/classificacao', controlerCampeonato.ranking)
router.post('/campeonato', authMiddleware, controlerCampeonato.createJson)
router.put('/campeonato/:id/editar', authMiddleware, autorizacaoMiddleware, controlerCampeonato.updateJson)
router.delete('/campeonato/:id', authMiddleware, autorizacaoMiddleware, controlerCampeonato.deleteJson)
// rotas resultados
router.get('/resultadoCorrida', controlerResultado.index)
router.get('/resultadoCorrida/:corridaId/:userId', controlerResultado.show)
router.post('/resultadoCorrida', authMiddleware, autorizacaoMiddleware, controlerResultado.create)
router.post('/resultadoCorrida/:campeonatoId/:corridaId/resultados', authMiddleware, autorizacaoMiddleware, controlerResultado.createMany)
router.put('/resultadoCorrida/:corridaId/:userId', authMiddleware, autorizacaoMiddleware, controlerResultado.update)
router.put('/resultadoCorrida/:campeonatoId/:corridaId/updateMany', authMiddleware, autorizacaoMiddleware, controlerResultado.updateManyJson)
router.delete('/resultadoCorrida/:corridaId/:userId', authMiddleware, autorizacaoMiddleware, controlerResultado.delete)

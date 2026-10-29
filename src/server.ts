import cors from 'cors'
import express from "express";
import cookieParser from 'cookie-parser';
import { router } from './router/router.js'
import { HttpErrorHandler } from './middleWare/httpErrorMid.js';
import { ControlerCampeonato } from './controler/campeonatoControler.js';
import { ControlerCorridas } from './controler/corridasControler.js';
import { ControlerResultado } from './controler/resultadoControler.js'
import { ControlerUser } from './controler/userControler.js';
import { recuperaSession } from './service/recuperaSessao.js';
import { authMiddleware } from './middleWare/autenticacaoMiddleware.js';
import { autorizacaoMiddleware } from './middleWare/autorizacaoMiddleware.js';

const app = express()
const controlerCampeonato = new ControlerCampeonato()
const controlerCorridas = new ControlerCorridas()
const controlerResultado = new ControlerResultado()
const controlerUser = new ControlerUser()

app.use(express.json())
app.use(cookieParser())
app.use(async (req, res, next) => {
  try {
    res.locals.currentUser = await recuperaSession(req.cookies?.token) ?? null
    next()
  } catch (error) {
    next(error)
  }
})
app.use(cors())
app.set('view engine', 'ejs')
app.set('views', './src/views')
app.use(express.static('./src/public'))
app.use(express.urlencoded({ extended: true }))
app.get('/', controlerCampeonato.home)
app.get('/login', (req, res) => res.render('login'))
app.post('/login', controlerUser.login)
app.post('/logout', controlerUser.logout)
app.post('/usuarios', authMiddleware, autorizacaoMiddleware, controlerUser.create)
app.get('/usuarios/:id/public', authMiddleware, controlerUser.showPerfilPublic)
app.get('/usuarios/novo', authMiddleware, autorizacaoMiddleware, (req, res) => res.render('usuario-novo'))
app.get('/usuarios/:id/editar', authMiddleware, controlerUser.showEditPage)
app.get('/usuarios/:id', controlerUser.showPage)
app.get('/perfil', authMiddleware,controlerUser.showPerfil)
app.get('/usuarios', controlerUser.index)
app.get('/campeonatos', controlerCampeonato.campeonatosPage)
app.get('/campeonato/:id', authMiddleware, controlerCampeonato.show)
app.get('/corridas', controlerCorridas.indexPage)
app.get('/campeonatos/novo', authMiddleware, (req, res) => res.render("campeonato-novo"))
app.post('/campeonatos', authMiddleware, controlerCampeonato.create)
app.get('/campeonato/:id/editar', authMiddleware, autorizacaoMiddleware, controlerCampeonato.showEditar)
app.get('/corridas/nova', authMiddleware, autorizacaoMiddleware, controlerCorridas.corridaNovaPage)
app.post('/corridas', authMiddleware, autorizacaoMiddleware, controlerCorridas.create)
app.get('/corridas/:id', controlerCorridas.showPage)
app.get('/corridas/:id/editar', authMiddleware, autorizacaoMiddleware, controlerCorridas.showPageEditar)
app.get('/campeonato/:campeonatoId/corrida/:id', controlerCorridas.showPage)
app.get('/campeonato/:campeonatoId/corrida/:id/resultados', controlerCorridas.showPage)
app.get('/classificacao', controlerCampeonato.classificacao)
app.get('/campeonato/:id/classificacao', controlerCampeonato.classificacaoPorCampeonato)
app.post(
  '/campeonato/:campeonatoId/corrida/:corridaId/resultados',
  authMiddleware,
  autorizacaoMiddleware,
  controlerResultado.createManyShow
)
app.use("/api", router)
app.use(HttpErrorHandler)
const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log('Servidor iniciado!')
})

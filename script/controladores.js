import { capturaDadosCorridas, validaDados } from "./capduraDados.js"
import { listarTabela, limparCampos, mensagemReturn } from "./view.js"

// import campeonato from '../index.js'

// CONTROLADORES

export function adicionarCorridaControle(campeonato){
     const dados = capturaDadosCorridas()


    try{
        validaDados(campeonato.getPilotos(), dados.posicoes)
        const corrida = campeonato.criarCorrdia(dados)

        const confirma = confirm(`Deseja adicionar os pilotos nas posições:
        1-${campeonato.getPilotos()[dados.posicoes[0]].nome}
        2-${campeonato.getPilotos()[dados.posicoes[1]].nome}
        3-${campeonato.getPilotos()[dados.posicoes[2]].nome}
        4-${campeonato.getPilotos()[dados.posicoes[3]].nome}
        `
    )

    if(confirma){
        mensagemReturn('Corrida cadastrada com sucesso!')
        campeonato.cadastrarCorrida(corrida)
        listarTabela(campeonato.getPilotos())
        setTimeout(() => limparCampos(), 2000)
        
    }

    }
    catch (error) {
        mensagemReturn(error.message)
    }
}

export function adicionarPilotoControle (campeonato){
    const sectionPilotoReset = document.getElementById('adicionarPilotoSection')
        const nomePiloto = document.getElementById('nome').value.trim()

        if(nomePiloto.length > 2){
            const confirma = confirm(`Cadastrar o piloto ${nomePiloto}`) 

            if(confirma){
                campeonato.cadastrarPiloto(nomePiloto)
                listarTabela(campeonato.getPilotos())
                limparCampos()
                sectionPilotoReset.classList.remove('adicionarDados-active')
            }
        } else{
            alert('Informe Nome do piloto!')
        }   
}     

export default {adicionarCorridaControle, adicionarPilotoControle}
import {limparCampos} from './view.js'

// CAPTURA DADOS CORRIDA

function capturaDadosCorridas (){
    const nomePista = document.getElementById('nomePista').value
    const duracaoCorrida = Number(document.getElementById('duracaoCorrida').value) 
    const posicoes = [...document.querySelectorAll('.posicao')].map(input => Number(input.value))

    return {nomePista, duracaoCorrida, posicoes}
}

// VALIDA DADOS

function validaDados(campeonato, pilotosPosicao){
    const numPilotos = Object.keys(campeonato.getPilotos())

    const strVazia = pilotosPosicao.every(p => p !== '' && p !== 0)
    
    const existe = pilotosPosicao.every(piloto => numPilotos.includes(String(piloto)))

    const pilotoRepetido = new Set(pilotosPosicao)   

    return (
        strVazia &&
            existe &&
             pilotoRepetido.size === pilotosPosicao.length
    )
}

export {capturaDadosCorridas, limparCampos, validaDados}
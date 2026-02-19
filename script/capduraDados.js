import {limparCampos} from './view.js'

// CAPTURA DADOS CORRIDA

function capturaDadosCorridas (){
    const nomePista = document.getElementById('nomePista').value
    const duracaoCorrida = Number(document.getElementById('duracaoCorrida').value) 
    const posicoes = [...document.querySelectorAll('.posicao')].map(input => Number(input.value))

    return {nomePista, duracaoCorrida, posicoes}
}

// VALIDA DADOS

function validaString (pilotos){
    const strVazia = pilotos.every(p => p !== '' && p !== 0)

    if(!strVazia){
        throw new Error ("Informe o nome do piloto!")
    } else {
        return true
    }
}

function pilotoExiste (campeonato, pilotos){
    const numPilotos = Object.keys(campeonato)
    let existe = pilotos.every(piloto => numPilotos.includes(String(piloto)))

    if(existe){
        return existe
    } else {
       throw new Error ('Numero de piloto inválido')
    }
}

function repitido (pilotos){
    const pilotoRepetido = new Set(pilotos)   

    if(pilotoRepetido.size === pilotos.length){
        return true   
   } else {
       throw new Error ('Informado numero de pilotos repitidos!') 
   }
}

function validaDados(campeonato, pilotosPosicao){
    validaString(pilotosPosicao)
    pilotoExiste(campeonato, pilotosPosicao)
    repitido(pilotosPosicao)

    return true
}

export {capturaDadosCorridas, limparCampos, validaDados}
import criarCampeonato from './criariCampeonato.js'
import { corpoTabela, tabela } from "./dom.js"

const mensagemRetorno = document.getElementById('mensagemReturn')

function renderizar(tabelaOrdenada, pilotosCadastrados){
    tabelaOrdenada.forEach((item, index) =>{

    const tr = document.createElement('tr')

    const linhaRank = document.createElement('td')
    linhaRank.innerText = index + 1

    const linhaNome = document.createElement('td')
    linhaNome.innerText = pilotosCadastrados[item].nome

    const linhaCorridas = document.createElement('td')
    linhaCorridas.innerText = pilotosCadastrados[item].corridas

    const linhaNumero = document.createElement('td')
    linhaNumero.innerText = pilotosCadastrados[item].numero

    const linhaPontos = document.createElement('td')
    linhaPontos.innerText = pilotosCadastrados[item].pontos

    tr.append(linhaRank, linhaNumero, linhaNome, linhaCorridas,linhaPontos)
    corpoTabela.append(tr)
    
})

}

// RENDERIZA A TABELA, SEMPRE ORDENANDO PELA PONTUAÇÃO
 export function listarTabela(pilotosCadastrados) {
    // RESETA A LISTA NO DOM PARA EVITAR DUPLICIDADE
    corpoTabela.innerHTML = ''
    // TRANSFORMA O OBJETO EM ARR PARA ACESSAR OS DADOS ATRAVÉS DE METODOS

    const tabelaOrdenada = ordenaTabela(pilotosCadastrados)
     renderizar(tabelaOrdenada, pilotosCadastrados)
    tabela.appendChild(corpoTabela)
}

//ORDENA TABELA
    function ordenaTabela(pilotosCadastrados){
    let tabelaOrdenada = Object.keys(pilotosCadastrados).sort((a, b) => {
         return pilotosCadastrados[b].pontos - pilotosCadastrados[a].pontos
    })
    return tabelaOrdenada
}


export function mensagemReturn (mensagem) {
    mensagemRetorno.textContent = mensagem

}

// LIMPAR CAMPOS
export function limparCampos(){
    const sectionAdicionaCorrida = document.getElementById('adicionarCorridaSection')
    document.getElementById('mensagemReturn').textContent = ''

    document.querySelectorAll('.adicionarDados input').forEach(item => {
        item.value = ''
    })

    sectionAdicionaCorrida.classList.remove('adicionarDados-active')
}


export default {renderizar, listarTabela, limparCampos, mensagemReturn}
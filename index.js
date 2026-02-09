// PONTOS PREDEFINIDOS
const pontos = Object.freeze 
({
1: 10,
2: 8,
3: 6,
4: 4 
})

let idCorrida = 1
let numerosPilotos = []
let pilotos = {
       8: { nome: 'max', numero: 8, corridas: 0, pontos: 0 },
       1: { nome: 'victor',numero: 1, corridas: 0, pontos: 0 },
       2: { nome: 'gabriel', numero: 2, corridas: 0, pontos: 0 },
       3: { nome: 'keavin', numero: 3, corridas: 0, pontos: 0 },
       4: { nome: 'arthur',numero: 4, corridas: 0, pontos: 0 },
       5: { nome: 'João', numero: 5, corridas: 0, pontos: 0 },
       6: { nome: 'Bryan',numero: 6,  corridas: 0, pontos: 0 },
       7: { nome: 'alcides', numero: 7, corridas: 0, pontos: 0 }
}
let corridas = {}


// DOM TABELA
const tabela = document.getElementById('rankTabela')
const corpoTabela = document.createElement('tbody')

// DOM ADC PILOTO

const adicionaPilotoContainer = document.getElementById('adicionaPilotoContainer')
const adcPiloto = document.getElementById('adcPiloto')

// DOM ADC CORRIDA

const adicionarCorridaSection = document.getElementById('adicionaCorridaSectionbT')
const adcCorrida = document.getElementById('adcCorrida') 


// GERA UM NUMERO ENTRE 0 E 100
function id(listaId) {
    let numeroId = Math.floor(Math.random() * 100) + 1

    // VALIDA SE NUMERO EXISTE NO ARRAY
    if (listaId.includes(numeroId)) {
        return id(listaId)
    } else {
        // SE NÃO EXISTE INCLUI E RETORN O ARR
        listaId.push(numeroId)
        return numeroId
    }
}

// CADASTRA UM PILOTO POR VEZ, RECEBENDO O ID ALEATÓRIO
function cadastrarPiloto(nomePiloto, idPiloto, pilotosCadastrados) {
    let piloto = { nome: nomePiloto, numero: idPiloto, corridas: 0, pontos: 0 }
    pilotosCadastrados[idPiloto] = piloto
}

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

function ordenaTabela(pilotosCadastrados){
    let tabelaOrdenada = Object.keys(pilotosCadastrados).sort((a, b) => {
         return pilotosCadastrados[b].pontos - pilotosCadastrados[a].pontos
    })
    return tabelaOrdenada
}

// RENDERIZA A TABELA, SEMPRE ORDENANDO PELA PONTUAÇÃO
function listarTabela(pilotosCadastrados) {

    // RESETA A LISTA NO DOM PARA EVITAR DUPLICIDADE
    corpoTabela.innerHTML = ''
    // TRANSFORMA O OBJETO EM ARR PARA ACESSAR OS DADOS ATRAVÉS DE METODOS

    const tabelaOrdenada = ordenaTabela(pilotosCadastrados)
     renderizar(tabelaOrdenada, pilotosCadastrados)
    tabela.appendChild(corpoTabela)
}

// CADASTRAR UMA CORRIDA
function cadastrarCorrida(nomePista, duracao, posicoes, pilotosCadastrados, corridasDb, idCorridas) {
    // CRIANDO O OBJETO COM AS INFORMAÇÕES DA CORRIDA
    let corrida = { pista: nomePista, duracao: duracao, posicoes }
    // ID CORRIDA CRIA A CHAVE ALEATORIA/NUMERO DO PILOTO E ADICIONA O OBJ QUE CRIEI, EX 20 = {PENHA, 20, [1,2,3,4]}
    corridasDb[idCorridas] = corrida
    // CHAMA A ATUALIZAÇÃO DA TABELA
    atualizarTabela(pilotosCadastrados, corridasDb, idCorridas)
}

// CRIA OBJ CORRIDA

function criarCorrdia (dados) {
    return {
        pista: dados.nomePista,
        duracao: dados.duracao,
        posicoes: dados.posicoes
    }
}

// ATUALIZA TABELA
function atualizarTabela(pilotosCadastrados, corridasDb, idCorrida) {

    // SELECIONA A CORRIDA NO OBJETO CORRIDA ATRAVÉS DO ID DA CORRIDA ATUAL EX SE CADASTROU A CORRIDA 4 SERA CORRIDA[4]
    let corrida = corridasDb[idCorrida]

    // ATRAVÉS DA CORRIDA 4 NA CHAVE POSIÇÕES QUE É UM ARRAY USA O METODO PARA SOMAR PONTOS CONFORME A POSIÇÃO
    corrida.posicoes.forEach((piloto, index) => {
        let posicao = index + 1
        pilotosCadastrados[piloto].pontos += pontos[posicao] || 0
    })

    // INCREMENTA SEMPRE 1 CORRIDA AO VALOR ATUAL, SENDO PILOTOID o ID DO PILOTO
    for (let pilotoId in pilotosCadastrados) {
        pilotosCadastrados[pilotoId].corridas++
    }
}

// CAPTURA DADOS CORRIDA

function capturaDadosCorridas (){
    const nomePista = document.getElementById('nomePista').value
    const duracaoCorrida = document.getElementById('duracaoCorrida').value 
    const posicoes = [...document.querySelectorAll('.posicao')].map(input => Number(input.value))

    return {nomePista, duracaoCorrida, posicoes}
}

// LIMPAR CAMPOS
function limparCampos(){
        document.getElementById('nome').value = null
        document.getElementById('nomePista').value = ''
        document.getElementById('duracaoCorrida').value = ''
        document.getElementById('posicao1').value = ''
        document.getElementById('posicao2').value = ''
        document.getElementById('posicao3').value = ''
        document.getElementById('posicao4').value = ''
}

// VALIDA DADOS

function validaDados(pilotosLista, pilotosPosicao){

    const numPilotos = Object.keys(pilotosLista)

    const strVazia = pilotosPosicao.every(p => p !== '' && p !== 0)
    
    const existe = pilotosPosicao.every(piloto => numPilotos.includes(String(piloto)))
    
    const pilotoRepetido = new Set(pilotosPosicao)   

    if(strVazia && existe && pilotoRepetido.size === pilotosPosicao.length){
        return true
    }
}

// ADICIONA O ELEMENTO NA TELA

adicionaPilotoContainer.addEventListener('click', () => {
    const sectionPiloto = document.getElementById('adicionarPilotoSection')
    const nomePilotoFocus = document.getElementById('nome')

    if(sectionPiloto.classList.contains('adicionarDados')){
        sectionPiloto.classList.toggle('adicionarDados-active')
        nomePilotoFocus.focus()
    } 
})

adicionarCorridaSection.addEventListener('click', () => {
    const sectionCorrida = document.getElementById('adicionarCorridaSection')
    const nomeCorridaFocus = document.getElementById('nomePista')

    if(sectionCorrida.classList.contains('adicionarDados')){
        sectionCorrida.classList.toggle('adicionarDados-active')
        nomeCorridaFocus.focus()
    } 
})

// EVENTO PARA ADICIONAR PILOTO

adcPiloto.addEventListener('click', () =>{

        const sectionPilotoReset = document.getElementById('adicionarPilotoSection')
        const nomePiloto = document.getElementById('nome').value.trim()

        if(nomePiloto.length > 2){
            const confirma = confirm(`Cadastrar o piloto ${nomePiloto}`) 
            const idDom = id(numerosPilotos)

            if(confirma){
                cadastrarPiloto(nomePiloto, idDom, pilotos)
                listarTabela(pilotos)
                limparCampos()
                sectionPilotoReset.classList.remove('adicionarDados-active')
            }
        } else{
            alert('Informe Nome do piloto!')
        }   
    }     
    )

// EVENTO PARA ADICIONAR CORRIDA

adcCorrida.addEventListener('click', () =>{

    const sectionAdicionaCorrida = document.getElementById('adicionarCorridaSection')

     const dados = capturaDadosCorridas()

    if(!validaDados(pilotos, dados.posicoes)){
        alert('Dados inválidos!')
        return
    }

     const corrida = criarCorrdia(dados)

    const confirma = confirm(`Deseja adicionar os pilotos nas posições:
        1-${pilotos[dados.posicoes[0]].nome}
        2-${pilotos[dados.posicoes[1]].nome}
        3-${pilotos[dados.posicoes[2]].nome}
        4-${pilotos[dados.posicoes[3]].nome}
        `
    )

    if(confirma){
        cadastrarCorrida(dados.nomePista, dados.duracaoCorrida, dados.posicoes, pilotos, corridas, idCorrida )
        listarTabela(pilotos)
        sectionAdicionaCorrida.classList.remove('adicionarDados-active')
        idCorrida++
        
    }

    limparCampos()
})

listarTabela(pilotos)
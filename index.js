// ESTADO DE VARIAVEIS GLOBAIS
function criarCampeonato (){

    // PONTOS PREDEFINIDOS
    const pontos = Object.freeze 
    ({
    1: 10,
    2: 8,
    3: 6,
    4: 4 
    })

    const state = {
    idCorrida: 1,
    numerosPilotos: [],
    pilotos: {
        8: { nome: 'max', numero: 8, corridas: 0, pontos: 0 },
        1: { nome: 'victor',numero: 1, corridas: 0, pontos: 0 },
        2: { nome: 'gabriel', numero: 2, corridas: 0, pontos: 0 },
        3: { nome: 'keavin', numero: 3, corridas: 0, pontos: 0 },
        4: { nome: 'arthur',numero: 4, corridas: 0, pontos: 0 },
        5: { nome: 'João', numero: 5, corridas: 0, pontos: 0 },
        6: { nome: 'Bryan',numero: 6,  corridas: 0, pontos: 0 },
        7: { nome: 'alcides', numero: 7, corridas: 0, pontos: 0 }
    },
    corridas: {}
}

    function getPilotos () {
        return state.pilotos
    }

    // GERA UM NUMERO ENTRE 0 E 100
    function id() {
    let numeroId = Math.floor(Math.random() * 100) + 1

    // VALIDA SE NUMERO EXISTE NO ARRAY
    if (state.numerosPilotos.includes(numeroId)) {
        return id()
    } else {
        // SE NÃO EXISTE INCLUI E RETORN O ARR
        state.numerosPilotos.push(numeroId)
        return numeroId
    }
}

    // CADASTRA UM PILOTO POR VEZ, RECEBENDO O ID ALEATÓRIO
    function cadastrarPiloto(nomePiloto) {
    const idPiloto = id()
    let piloto = { nome: nomePiloto, numero: idPiloto, corridas: 0, pontos: 0 }
     return state.pilotos[idPiloto] = piloto
}

//ORDENA TABELA
    function ordenaTabela(){
    let tabelaOrdenada = Object.keys(state.pilotos).sort((a, b) => {
         return state.pilotos[b].pontos - state.pilotos[a].pontos
    })
    return tabelaOrdenada
}

    // ATUALIZA TABELA
    function processarResultadoCorrida(){
    // SELECIONA A CORRIDA NO OBJETO CORRIDA ATRAVÉS DO ID DA CORRIDA ATUAL EX SE CADASTROU A CORRIDA 4 SERA CORRIDA[4] E COM AS POSIÇÕES DOS RESPECTIVOS QUATRO PRIMEIROS
    let corrida = state.corridas[state.idCorrida]

    const pontosCorrida = somaPontos(corrida)
    
    incrementaPontos(state.pilotos, pontosCorrida)

    // INCREMENTA SEMPRE 1 CORRIDA AO VALOR ATUAL, SENDO PILOTOID o ID DO PILOTO
    for (let pilotoId in state.pilotos) {
        state.pilotos[pilotoId].corridas++
    }
}

    // CRIA OBJ CORRIDA

    function criarCorrdia (dados) {
    // CRIANDO O OBJETO COM AS INFORMAÇÕES DA CORRIDA
    return {
        pista: dados.nomePista,
        duracao: dados.duracaoCorrida,
        posicoes: dados.posicoes
    }
}

    // CADASTRAR UMA CORRIDA
    function cadastrarCorrida(corridas) {
    // ID CORRIDA CRIA A CHAVE ALEATORIA/NUMERO DO PILOTO E ADICIONA O OBJ QUE CRIEI, EX 20 = {PENHA, 20, [1,2,3,4]}
    state.corridas[state.idCorrida] = corridas
    // CHAMA A ATUALIZAÇÃO DA TABELA
     processarResultadoCorrida()
     state.idCorrida++
}

// SOMA PONTOS

    function somaPontos (corrida){
    // ATRAVÉS DA CORRIDA 4 NA CHAVE POSIÇÕES QUE É UM ARRAY USA O METODO PARA SOMAR PONTOS CONFORME A POSIÇÃO
    const resultadoSoma = corrida.posicoes.map((piloto, index) => ({    
        piloto,
        pontos: pontos[index + 1] ?? 0
    }))

    return resultadoSoma
}

// INCREMENTA PONTOS

    function incrementaPontos (pilotosCadastrados, pontosCorrida){
    pontosCorrida.forEach(({piloto, pontos}) => {
        pilotosCadastrados[piloto].pontos += pontos
    })
}

    return{
        getPilotos,
        criarCorrdia,
        cadastrarCorrida,
        cadastrarPiloto,
        ordenaTabela
    }

}

const campeonato = criarCampeonato()

// DOM TABELA
const tabela = document.getElementById('rankTabela')
const corpoTabela = document.createElement('tbody')

// DOM ADC PILOTO

const adicionaPilotoContainer = document.getElementById('adicionaPilotoContainer')
const adcPiloto = document.getElementById('adcPiloto')

// DOM ADC CORRIDA

const adicionarCorridaSection = document.getElementById('adicionaCorridaSectionbT')
const adcCorrida = document.getElementById('adcCorrida') 

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
function listarTabela(pilotosCadastrados) {
    // RESETA A LISTA NO DOM PARA EVITAR DUPLICIDADE
    corpoTabela.innerHTML = ''
    // TRANSFORMA O OBJETO EM ARR PARA ACESSAR OS DADOS ATRAVÉS DE METODOS

    const tabelaOrdenada = campeonato.ordenaTabela()
     renderizar(tabelaOrdenada, pilotosCadastrados)
    tabela.appendChild(corpoTabela)
}

// CAPTURA DADOS CORRIDA

function capturaDadosCorridas (){
    const nomePista = document.getElementById('nomePista').value
    const duracaoCorrida = Number(document.getElementById('duracaoCorrida').value) 
    const posicoes = [...document.querySelectorAll('.posicao')].map(input => Number(input.value))

    return {nomePista, duracaoCorrida, posicoes}
}

// LIMPAR CAMPOS
function limparCampos(){
        
     document.querySelectorAll('.adicionarDados input').forEach(item => {
        item.value = ''
    })
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

// CONTROLADORES

function adicionarCorridaControle(){
     const sectionAdicionaCorrida = document.getElementById('adicionarCorridaSection')

     const dados = capturaDadosCorridas()

    if(!validaDados(campeonato, dados.posicoes)){
        alert('Dados inválidos!')
        return
    }

     const corrida = campeonato.criarCorrdia(dados)

    const confirma = confirm(`Deseja adicionar os pilotos nas posições:
        1-${campeonato.getPilotos()[dados.posicoes[0]].nome}
        2-${campeonato.getPilotos()[dados.posicoes[1]].nome}
        3-${campeonato.getPilotos()[dados.posicoes[2]].nome}
        4-${campeonato.getPilotos()[dados.posicoes[3]].nome}
        `
    )

    if(confirma){
        campeonato.cadastrarCorrida(corrida)
        listarTabela(campeonato.getPilotos())
        sectionAdicionaCorrida.classList.remove('adicionarDados-active')
    }

    limparCampos()
}

function adicionarPilotoControle (){
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

adcPiloto.addEventListener('click', adicionarPilotoControle)

// EVENTO PARA ADICIONAR CORRIDA

adcCorrida.addEventListener('click', adicionarCorridaControle)

listarTabela(campeonato.getPilotos())
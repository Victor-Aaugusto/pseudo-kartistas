import criaEstado from './state.js'

// ESTADO DE VARIAVEIS GLOBAIS
export function criarCampeonato (){

    
    const {state, pontos} = criaEstado()

    function getCorrdias (){
        return state.corridas
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
        getCorrdias,
        criarCorrdia,
        cadastrarCorrida,
        cadastrarPiloto,
    }

}

export default criarCampeonato

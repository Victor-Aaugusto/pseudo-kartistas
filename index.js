let menu = ''
let idCorrida = 1
let numerosPilotos = []
let pilotos = {
   1:{nome: 'victor', corridas: 0, pontos: 0},
   2:{nome: 'gabriel', corridas: 0, pontos: 0},
   3:{nome: 'keavin', corridas: 0, pontos: 0},
   4:{nome: 'arthur', corridas: 0, pontos: 0},
   5:{nome: 'João', corridas: 0, pontos: 0},
   6:{nome: 'Bryan', corridas: 0, pontos: 0},
   7:{nome: 'alcides', corridas: 0, pontos: 0},
   8:{nome: 'max', corridas: 0, pontos: 0},
}

let corridas = {}
// GERA UM NUMERO ENTRE 0 E 100

function id (listaId) {
    let numeroId = Math.floor(Math.random() * 100) + 1

    // VALIDA SE NUMERO EXISTE NO ARRAY
    if(listaId.includes(numeroId)){
        return id(listaId)
        
    } else{
       // SE NÃO EXISTE INCLUI E RETORN O ARR 
       listaId.push(numeroId)
       return numeroId
    }
}

// CADASTRA UM PILOTO POR VEZ, RECEBENDO O ID ALEATÓRIO

function cadastrarPiloto(nomePiloto, idPiloto, pilotosCadastrados){
    let piloto = {nome: nomePiloto, numero: idPiloto, corridas: 0, pontos: 0}
    pilotosCadastrados[idPiloto] = piloto
}

// RENDERIZA A TABELA, SEMPRE ORDENANDO PELA PONTUAÇÃO

function listarTabela (pilotosCadastrados) {
    let posicao = 1
    let tabela = ''

// TRANSFORMA O OBJETO EM ARR PARA ACESSAR OS DADOS ATRAVÉS DE METODOS

    let tabelaOrdenada = Object.keys(pilotosCadastrados).sort((a, b) =>{
        return pilotosCadastrados[b].pontos - pilotosCadastrados[a].pontos
    })

// ARRAY TRANSFORMADO COM METODO PARA CONCATENAR EM UMA STRING TODA A TABELA
    tabelaOrdenada.forEach(item => {
        // OBJETO[REPETICAO].CHAVE => PILOTO[1].VICTOR
        tabela += `Posição: ${posicao}º Nome: ${pilotosCadastrados[item].nome} - Numero ${pilotosCadastrados[item].numero} - Corridas: ${pilotosCadastrados[item].corridas} - Pontos: ${pilotosCadastrados[item].pontos} \n`
        posicao++
    })

    return tabela   
}

// CADASTRAR UMA CORRIDA

function cadastrarCorrida (nomePista, duracao, posicoes, pilotosCadastrados , corridasDb, idCorridas) {
    // CRIANDO O OBJETO COM AS INFORMAÇÕES DA CORRIDA
    let corrida = {pista: nomePista, duracao: duracao, posicoes}
    // ID CORRIDA CRIA A CHAVE ALEATORIA/NUMERO DO PILOTO E ADICIONA O OBJ QUE CRIEI, EX 20 = {PENHA, 20, [1,2,3,4]}
    corridasDb[idCorridas] = corrida
    // CHAMA A ATUALIZAÇÃO DA TABELA
    atualizarTabela(pilotosCadastrados, corridasDb, idCorridas)  
}



function atualizarTabela (pilotosCadastrados, corridasDb, idCorrida) {
    // PONTOS PREDEFINIDOS
    let pontos = {1: 10, 2: 8, 3: 6, 4: 4, 5: 2}
    // SELECIONA A CORRIDA NO OBJETO CORRIDA ATRAVÉS DO ID DA CORRIDA ATUAL EX SE CADASTROU A CORRIDA 4 SERA CORRIDA[4]
    // let corridaValida = idCorrida > 1 ? idCorrida : 1
    let corrida = corridasDb[idCorrida]
    console.log(corrida, idCorrida)
    //  ATRAVÉS DA CORRIDA 4 NA CHAVE POSIÇÕES QUE É UM ARRAY USA O METODO PARA SOMAR PONTOS CONFORME A POSIÇÃO
    corrida.posicoes.forEach((piloto, index) => {
       let posicao = index + 1
       // OBJETO[idpiloto].pontos += obj[1,2,3,4,]
       pilotosCadastrados[piloto].pontos += pontos[posicao] || 0
    })

    // INCREMENTA SEMPRE 1 CORRIDA AO VALOR ATUAL, SENDO PILOTOID o ID DO PILOTO
    for(let pilotoId in pilotosCadastrados){
        pilotosCadastrados[pilotoId].corridas++
    }
}

do {
    
    menu = prompt(`Campeonato de pseudo kartistas 2026:
        1 - Cadastrar Piloto
        2 - Cadastrar Corrida
        3 - Sair
        
        Ranking atual:
        
        ${listarTabela(pilotos, idCorrida)}`)

    switch(menu){
        case '1':
            let nomePiloto = prompt(`Qual o nome do piloto?`)
            let idPiloto = id(numerosPilotos)

            let confirma = confirm(`Deseja cadastrar o piloto ${nomePiloto}`)

            if(confirma && nomePiloto.length > 3){
               alert(`Piloto ${nomePiloto} cadastrado com sucesso!`) 
               cadastrarPiloto(nomePiloto, idPiloto, pilotos)
            } else {
                alert(`Dados inválidos, nome deve ser um texto!`)
            }
            break
            case '2':
                let posicoes = []
                // CONTAGEM DA CORRIDA
                let idCorridas = idCorrida
                
                let nomePista = prompt('Qual o nome da pista?')
                let duracao = Number(prompt(`Qual duração da corrida? EX 20:00`))


                let p1 = Number(prompt(`Qual o número/id do primeiro lugar?`))
                let p2 = Number(prompt(`Qual o número/id do segundo lugar?`))
                let p3 = Number(prompt(`Qual o número/id do terceiro lugar?`))
                let p4 = Number(prompt(`Qual o número/id do quarto lugar?`))

                posicoes.push(p1, p2, p3, p4)
                // let repeticao = new Set(posicoes).size === posicoes.length

                if(pilotos[p1] !== undefined && pilotos[p2] !== undefined && pilotos[p3] !== undefined && pilotos[p4] !== undefined){
                    let confirmacao = confirm(`Inserir a corrida:
                    Pista: ${nomePista}
                    Duração: ${duracao}
                    Posições:
                    1º - ${pilotos[p1].nome} 
                    2º - ${pilotos[p2].nome} 
                    3º - ${pilotos[p3].nome} 
                    4º - ${pilotos[p4].nome}
                    `)

                if(confirmacao && new Set(posicoes).size === posicoes.length){
                    alert('Corrida cadastrada com sucesso!')
                    cadastrarCorrida(nomePista, duracao, posicoes, pilotos, corridas, idCorridas)
                    idCorrida++  
                } 
                } else {
                    alert('Dados de pilotos inválidos ou cadastrados duplicados')
                }

            break
            case '3':
                alert(`Saindo!...`)
            break
            default:
                alert('Opção inválida')
    }

} while (menu !== '3');
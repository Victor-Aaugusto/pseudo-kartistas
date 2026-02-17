export function criaEstado (){
    // PONTOS PREDEFINIDOS
    const pontos = Object.freeze 
    ({
    1: 10,
    2: 8,
    3: 6,
    4: 4 
    })

    //ESTADO DO CAMPEONATO
    
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

    return {state, pontos}
}


export default criaEstado
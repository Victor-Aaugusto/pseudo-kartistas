// DOM TABELA
export const tabela = document.getElementById('rankTabela')
export const corpoTabela = document.createElement('tbody')
export const mensagemReturn = document.getElementById('mensagemReturn')

// DOM ADC PILOTO

export const adicionaPilotoContainer = document.getElementById('adicionaPilotoSectionBt')
const adcPiloto = document.getElementById('adcPiloto')

// DOM ADC CORRIDA

export const adicionarCorridaSection = document.getElementById('adicionaCorridaSectionBt')
const adcCorrida = document.getElementById('adcCorrida') 

export default {adicionaPilotoContainer, adicionarCorridaSection, tabela, corpoTabela, mensagemReturn}
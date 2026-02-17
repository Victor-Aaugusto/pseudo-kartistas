import  {listarTabela} from "./script/view.js"
import {criarCamp} from './script/controladores.js'
import {adicionarCorridaControle, adicionarPilotoControle} from './script/controladores.js'
import {adicionaPilotoContainer, adicionarCorridaSection} from './script/dom.js'



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

listarTabela(criarCamp.getPilotos())
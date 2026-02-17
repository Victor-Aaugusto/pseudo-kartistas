import { capturaDadosCorridas, validaDados } from "./capduraDados.js"
import { listarTabela, limparCampos } from "./view.js"
import criarCampeonato from './criarCampenato.js'

export const criarCamp = criarCampeonato()
window.criarCamp = criarCamp
// CONTROLADORES

export function adicionarCorridaControle(){
     const sectionAdicionaCorrida = document.getElementById('adicionarCorridaSection')

     const dados = capturaDadosCorridas()

    if(!validaDados(criarCamp, dados.posicoes)){
        alert('Dados inválidos!')
        return
    }

     const corrida = criarCamp.criarCorrdia(dados)

    const confirma = confirm(`Deseja adicionar os pilotos nas posições:
        1-${criarCamp.getPilotos()[dados.posicoes[0]].nome}
        2-${criarCamp.getPilotos()[dados.posicoes[1]].nome}
        3-${criarCamp.getPilotos()[dados.posicoes[2]].nome}
        4-${criarCamp.getPilotos()[dados.posicoes[3]].nome}
        `
    )

    if(confirma){
        criarCamp.cadastrarCorrida(corrida)
        listarTabela(criarCamp.getPilotos())
        sectionAdicionaCorrida.classList.remove('adicionarDados-active')
    }

    limparCampos()
}

export function adicionarPilotoControle (){
    const sectionPilotoReset = document.getElementById('adicionarPilotoSection')
        const nomePiloto = document.getElementById('nome').value.trim()

        if(nomePiloto.length > 2){
            const confirma = confirm(`Cadastrar o piloto ${nomePiloto}`) 

            if(confirma){
                criarCamp.cadastrarPiloto(nomePiloto)
                listarTabela(criarCamp.getPilotos())
                limparCampos()
                sectionPilotoReset.classList.remove('adicionarDados-active')
            }
        } else{
            alert('Informe Nome do piloto!')
        }   
}     

export default {adicionarCorridaControle, adicionarPilotoControle, criarCamp}
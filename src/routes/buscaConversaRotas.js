/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API
* Data: 08/04/2026
* Autor: Jean Costa
* Versão 1.0
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerWhatsapp = require('../controller/buscaConversaController.js')

rota.get('/dados', (request, response) => {
    let dados = controllerWhatsapp.listarTodosDados()
    
    if (dados) {
        response.json({
          status: "true",
          status_code: 200,
          Desenvolvedor: "Jean Costa",
          dados
        })
      } else {
        response.json({
          status: "false",
          status_code: 404,
          Desenvolvedor: "Jean Costa",
          message: "Os dados não foram encontrados!",
        })
      }
})

rota.get('/usuarios/dados', (request, response) => {
    let dados = controllerWhatsapp.listarDadosContato()
    
    if (dados) {
        response.json({
          status: "true",
          status_code: 200,
          Desenvolvedor: "Jean Costa",
          dados
        })
      } else {
        response.json({
          status: "false",
          status_code: 404,
          Desenvolvedor: "Jean Costa",
          message: "Os dados do usuário não foram encontrados!",
        })
      }

})

rota.get('/usuario/perfil', (request, response) => {
  let numeroUsuario = request.query.numero
  let dadosPerfil = controllerWhatsapp.listarProfileUsuario(numeroUsuario)
  
  if (dadosPerfil && dadosPerfil.status) { 
      response.status(200).json({
        status: true,
        status_code: 200,
        Desenvolvedor: "Jean Costa",
        dadosPerfil
      })
  } else {
      response.status(404).json({
        status: false,
        status_code: 404,
        Desenvolvedor: "Jean Costa",
        message: "O número informado não foi encontrado no sistema!",
      })
  }
})

rota.get('/usuario/contatos', (request, response) => {
  let numeroUsuario = request.query.numero
  let dadosContatos = controllerWhatsapp.listarContatoUsuario(numeroUsuario)

  if (dadosContatos && dadosContatos.status) { 
      response.status(200).json({
        status: true,
        status_code: 200,
        Desenvolvedor: "Jean Costa",
        dadosContatos
      })
  } else {
      response.status(404).json({
        status: false,
        status_code: 404,
        Desenvolvedor: "Jean Costa",
        message: "O número informado não foi encontrado no sistema!",
      })
  }
})

rota.get('/usuario/conversas', (request, response) => {
  let numeroUsuario = request.query.numero
  let dadosConversas = controllerWhatsapp.listarMensagensContatoUsuario(numeroUsuario)

  if (dadosConversas && dadosConversas.status) { 
      response.status(200).json({
        status: true,
        status_code: 200,
        Desenvolvedor: "Jean Costa",
        dadosConversas
      })
  } else {
      response.status(404).json({
        status: false,
        status_code: 404,
        Desenvolvedor: "Jean Costa",
        message: "O número informado não foi encontrado no sistema!",
      })
  }
})

rota.get('/usuario/conversa/direta', (request, response) => {
  let numeroUsuario = request.query.numero
  let nomeContato = request.query.contato
  let dadosConversaDireta = controllerWhatsapp.mensagemDiretaContatoUsuario(numeroUsuario, nomeContato)

  if (dadosConversaDireta && dadosConversaDireta.status) { 
      response.status(200).json({
        status: true,
        status_code: 200,
        Desenvolvedor: "Jean Costa",
        dadosConversaDireta
      })
  } else {
      response.status(404).json({
        status: false,
        status_code: 404,
        Desenvolvedor: "Jean Costa",
        message: "O número ou contato informado não foi encontrado no sistema!",
      })
  }
})

rota.get('/usuario/busca', (request, response) => {
  let palavraChave = request.query.busca
  let dadosBusca = controllerWhatsapp.filtroPalavra(palavraChave)

  if (dadosBusca && dadosBusca.status) { 
      response.status(200).json({
          status: true,
          status_code: 200,
          Desenvolvedor: "Jean Costa",
          dadosBusca
      })
  } else {
      response.status(404).json({
          status: false,
          status_code: 404,
          Desenvolvedor: "Jean Costa",
          message: "Nenhuma mensagem encontrada com a palavra-chave informada!",
      })
  }
})

module.exports = rota
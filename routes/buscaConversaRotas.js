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
    
})



module.exports = rota
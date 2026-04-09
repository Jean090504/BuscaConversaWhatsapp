/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela API do projeto Whatsapp
 * Data: 08/04/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

// Criação do objeto app
const app = express()

// Permite que o Express entenda JSON no corpo 
app.use(express.json())

const corsOptions = {
    origin: "*",
    methods: "GET", 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true 
}

app.use(cors(corsOptions))
app.use(helmet())

// --- IMPORTAÇÃO DAS ROTAS ---

const buscaConversaRotas = require('./routes/buscaConversaRotas.js') 

app.use('/v1/whatsapp', buscaConversaRotas)

module.exports = app
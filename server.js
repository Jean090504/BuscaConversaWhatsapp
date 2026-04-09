/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por inicializar o servidor da API Whatsapp
* Data: 08/04/2026
* Autor: Jean Costa
* Versão 1.0 
********************************************************************************************************************************************/

const app = require('./src/app');

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`
    ====================================================
    🚀 SERVIDOR ONLINE!
    📡 URL Local: https://simulando-app-de-mensagens.onrender.com/
    🛠️  Status: Operacional
    ====================================================
    `)
})
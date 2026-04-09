/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Whatsapp
 * Data: 08/04/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo
const { contatos } = require("../../model/contatos.js")
const bancoDeDados = contatos

const listarTodosDados = () => {
    let status = false

        bancoDeDados["whats-users"].forEach(itemDados => {
            if (itemDados) {
                status = true
            }
        })

    return {
        status: status,
        dadosUsuario: bancoDeDados["whats-users"]
    }
}

const listarDadosContato = () => {
    let status = false
    let listarDados = []

    bancoDeDados["whats-users"].forEach(itemDados => {
        if (itemDados) {
            status = true
            listarDados.push(itemDados)
        }
    })

    return {
        status: status,
        quantidade: listarDados.length,
        dadosUsuario: listarDados
    }
}

const listarProfileUsuario = (numeroUsuario) => {
    let status = false
    let listarProfileUsuario = []

    bancoDeDados["whats-users"].forEach(itemUsuario => {
        if (itemUsuario.number === numeroUsuario) {
            status = true
            
            listarProfileUsuario.push({
                id: itemUsuario.id,
                nome: itemUsuario.account,
                nickname: itemUsuario.nickname,
                img: itemUsuario["profile-image"],
                background: itemUsuario.background,
                numero: itemUsuario.number,
                dataCriacao: itemUsuario["created-since"].start,
                dataEncerrada: itemUsuario["created-since"].end,
            })
        }
    })

    return {
        status: status,
        dadosDoPerfil: listarProfileUsuario
    }

}

const listarContatoUsuario = (numeroUsuario) => {
    let status = false
    let listarContatoUsuario = []

    bancoDeDados["whats-users"].forEach(itemUsuario => {
        if (itemUsuario.number === numeroUsuario) {
            status = true
            
            itemUsuario.contacts.forEach(itemDadosContato => {
                status = true
                listarContatoUsuario.push({
                    usuario: itemUsuario.account,
                    nomeContato: itemDadosContato.name,
                    imagemContato: itemDadosContato.image,
                    bioContato: itemDadosContato.description
                })
            })
        }
    })

    return {
        status: status,
        dadosUsuario: listarContatoUsuario
    }

}

const listarMensagensContatoUsuario = (numeroUsuario) => {
    let status = false
    let listarMensagem = []

    bancoDeDados["whats-users"].forEach(itemUsuario => {
        if (itemUsuario.number === numeroUsuario) {
            status = true
            
            itemUsuario.contacts.forEach(itemContato => {

                itemContato.messages.forEach(itemMensagem => {

                    let remetente = itemMensagem.sender.toLowerCase() === 'me' 
                        ? itemUsuario.account 
                        : itemMensagem.sender

                    listarMensagem.push({
                        usuario: itemUsuario.account,
                        nomeContato: itemContato.name,
                        mensagensTrocadas: itemMensagem.content,
                        remetente: remetente,
                        horarioDoEnvio: itemMensagem.time
                    })

                })

            })
            
        }
    })

    return {
        status: status,
        mensagensUsuario: listarMensagem
    }

}


const mensagemDiretaContatoUsuario = (numeroUsuario, nomeContato) => {
    let status = false 
    let listarMensagemDireta = []

    //Confirmo se o numero passado é realmente o numero do usuario
    const usuarioDono = bancoDeDados["whats-users"].find(item => item.number === numeroUsuario)

    if (usuarioDono) {
    const contatoAlvo = usuarioDono.contacts.find(itemContato => itemContato.name.toLowerCase() === nomeContato.toLowerCase())

        if (contatoAlvo) {
            status = true
            

            contatoAlvo.messages.forEach(itemMensagem => {
                let remetente = itemMensagem.sender.toLowerCase() === 'me' 
                    ? usuarioDono.account 
                    : itemMensagem.sender

                listarMensagemDireta.push({
                    usuario: usuarioDono.account,
                    nomeContato: contatoAlvo.name,
                    mensagensTrocadas: itemMensagem.content,
                    remetente: remetente,
                    horarioDoEnvio: itemMensagem.time
                })
            })

        }
    }

    if(status){
        return {
            status: status,
            mensagensUsuario: listarMensagemDireta
        }
    }else{
        return { status: false, mensagem: "Usuário ou contato não encontrado." }
    }

}

const filtroPalavra = (palavraChave) => {
    let listarMensagemPesquisada = []
    const busca = palavraChave.toLowerCase()

    bancoDeDados["whats-users"].forEach(itemUsuario => {
        itemUsuario.contacts.forEach(itemContato => {
            itemContato.messages.forEach(itemMensagem => {
                
                // Pegamos o conteúdo da mensagem e o nome do contato em minúsculo
                const conteudoMensagem = itemMensagem.content.toLowerCase()
                const nomeContato = itemContato.name.toLowerCase()

                //A palavra está no nome do contato OU no conteúdo da mensagem?
                if (conteudoMensagem.includes(busca) || nomeContato.includes(busca)) {
                    
                    let remetente = itemMensagem.sender.toLowerCase() === 'me' 
                        ? itemUsuario.account 
                        : itemMensagem.sender

                    listarMensagemPesquisada.push({
                        usuarioDono: itemUsuario.account,
                        contato: itemContato.name,
                        mensagem: itemMensagem.content,
                        remetente: remetente,
                        horarioEnvio: itemMensagem.time
                    })
                }
            })
        })
    })

    if (listarMensagemPesquisada.length > 0) {
        return {
            status: true,
            resultados: listarMensagemPesquisada
        }
    } else {
        return { 
            status: false, 
            mensagem: `Nenhum resultado encontrado para: "${palavraChave}"` 
        }
    }
}

module.exports = {
    listarTodosDados,
    listarDadosContato,
    listarProfileUsuario,
    listarContatoUsuario,
    listarMensagensContatoUsuario,
    mensagemDiretaContatoUsuario,
    filtroPalavra
}
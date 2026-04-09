/***************************************************************************************
 * Objetivo: Integração Completa do Front-end (Usuários, Contatos e Mensagens)
 * Data: 09/04/2026
 * Autor: Jean Costa
 **************************************************************************************/

const API_BASE_URL = 'https://sistema-de-conversas-app.onrender.com/v1/whatsapp';

async function inicializarDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/dados`);
        const result = await response.json();

        if (result.status) {
            const users = result.dadosUsuario;
            
            const totalEl = document.getElementById('total-contatos');
            if (totalEl) totalEl.textContent = users.length;

            renderizarTabela(users);
        }
    } catch (error) {
        console.error("Erro ao conectar com a API:", error);
        exibirErroTabela();
    }
}

// --- 2. RENDERIZAÇÃO DA TABELA DE OPERAÇÕES ---
function renderizarTabela(usuarios) {
    const tbody = document.getElementById('corpo-tabela');
    tbody.textContent = ""; 

    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/50 transition border-b border-slate-700/50";

        // Usuário
        const tdUser = document.createElement('td');
        tdUser.className = "px-6 py-4 flex items-center gap-3 text-white";
        const img = document.createElement('img');
        img.src = user["profile-image"];
        img.className = "w-8 h-8 rounded-full bg-slate-700 border border-slate-600 object-cover";
        const spanName = document.createElement('span');
        spanName.textContent = user.nickname;
        tdUser.appendChild(img);
        tdUser.appendChild(spanName);

        // Bio/Status
        const tdBio = document.createElement('td');
        tdBio.className = "px-6 py-4 italic text-slate-400";
        tdBio.textContent = user.background || "Sem descrição.";

        // Ação: Botão que dispara os detalhes
        const tdAction = document.createElement('td');
        tdAction.className = "px-6 py-4";
        const btn = document.createElement('button');
        btn.className = "text-indigo-400 hover:text-indigo-300 font-medium transition-colors";
        btn.textContent = "Ver Detalhes";
        
        // CORREÇÃO: Chama a função usando o número do usuário
        btn.onclick = () => verDetalhesUsuario(user.number);

        tdAction.appendChild(btn);
        tr.appendChild(tdUser);
        tr.appendChild(tdBio);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    });
}

// --- 3. BUSCA DE DETALHES (CONTATOS E MENSAGENS) ---
async function verDetalhesUsuario(numero) {
    const container = document.getElementById('detalhes-container');
    if (container) container.classList.remove('hidden'); 

    try {
        // Busca Contatos do Usuário selecionado
        const resContatos = await fetch(`${API_BASE_URL}/usuario/contatos?numero=${numero}`);
        const dataContatos = await resContatos.json();
        renderizarContatos(dataContatos.dadosUsuario || []);

        // Busca Histórico de Mensagens
        const resMensagens = await fetch(`${API_BASE_URL}/usuario/conversas?numero=${numero}`);
        const dataMensagens = await resMensagens.json();
        renderizarMensagens(dataMensagens.mensagensUsuario || []);
        
        // Scroll suave para a área de detalhes
        container.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
    }
}

// --- 4. AUXILIARES DE RENDERIZAÇÃO SEGURA ---
function renderizarContatos(contatos) {
    const lista = document.getElementById('lista-contatos-detalhe');
    lista.textContent = ""; 

    contatos.forEach(c => {
        const li = document.createElement('li');
        li.className = "flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 mb-2";
        
        const img = document.createElement('img');
        img.src = c.imagemContato;
        img.className = "w-10 h-10 rounded-full object-cover border border-slate-600";
        
        const info = document.createElement('div');
        const name = document.createElement('p');
        name.className = "text-xs text-white font-bold";
        name.textContent = c.nomeContato;
        
        const bio = document.createElement('p');
        bio.className = "text-[10px] text-slate-500 leading-tight";
        bio.textContent = c.bioContato;

        info.appendChild(name);
        info.appendChild(bio);
        li.appendChild(img);
        li.appendChild(info);
        lista.appendChild(li);
    });
}

function renderizarMensagens(mensagens) {
    const log = document.getElementById('log-mensagens');
    log.textContent = ""; 

    mensagens.forEach(m => {
        const msgDiv = document.createElement('div');
        msgDiv.className = "p-3 rounded mb-2 text-[11px] border-l-4 " + 
                          (m.remetente === m.usuario ? "border-indigo-500 bg-indigo-500/10" : "border-slate-600 bg-slate-800/40");
        
        const meta = document.createElement('div');
        meta.className = "flex justify-between mb-1 opacity-70";
        
        const sender = document.createElement('span');
        sender.className = "font-black uppercase tracking-tighter text-indigo-400";
        sender.textContent = m.remetente;

        const time = document.createElement('span');
        time.className = "text-slate-500 mono";
        time.textContent = m.horarioDoEnvio;

        const content = document.createElement('p');
        content.className = "text-slate-200 leading-relaxed";
        content.textContent = m.mensagensTrocadas;

        meta.appendChild(sender);
        meta.appendChild(time);
        msgDiv.appendChild(meta);
        msgDiv.appendChild(content);
        log.appendChild(msgDiv);
    });
}

function exibirErroTabela() {
    const tbody = document.getElementById('corpo-tabela');
    tbody.textContent = "Erro na comunicação com o servidor Render.";
}

document.addEventListener('DOMContentLoaded', inicializarDashboard);
/***************************************************************************************
 * Objetivo: Integração Refinada (M3) - UI Dinâmica e Segura
 * Autor: Jean Costa // Data: 09/04/2026
 **************************************************************************************/

const API_BASE_URL = 'https://sistema-de-conversas-app.onrender.com/v1/whatsapp';

// Inicialização segura do sistema
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('input-busca-global');
    
    inicializarDashboard();
    
    // Configura o evento de busca global
    inputBusca?.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const termo = inputBusca.value.trim();
            if (!termo) return;
            executarBuscaGlobal(termo);
        }
    });
});

async function inicializarDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/dados`);
        const result = await response.json();

        if (result.status === "true" && result.dados?.dadosUsuario) {
            const users = result.dados.dadosUsuario;
            const totalEl = document.getElementById('total-contatos');
            if (totalEl) totalEl.textContent = users.length.toString().padStart(2, '0');
            renderizarTabela(users);
        }
    } catch (error) {
        console.error("Falha na inicialização:", error);
        exibirErroTabela();
    }
}

function renderizarTabela(usuarios) {
    const tbody = document.getElementById('corpo-tabela');
    tbody.textContent = ""; 

    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-white/5 transition-all duration-300 border-b border-white/5 group";

        // Coluna Operador
        const tdUser = document.createElement('td');
        tdUser.className = "px-8 py-5 flex items-center gap-4 text-white font-medium";
        
        const avatarContainer = document.createElement('div');
        avatarContainer.className = "relative";
        
        const img = document.createElement('img');
        img.src = user["profile-image"];
        img.className = "w-10 h-10 rounded-xl bg-slate-800 border border-white/10 object-cover group-hover:border-purple-500/50 transition-all";
        
        const statusDot = document.createElement('span');
        statusDot.className = "absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full";
        
        avatarContainer.appendChild(img);
        avatarContainer.appendChild(statusDot);

        const infoDiv = document.createElement('div');
        const nickP = document.createElement('p');
        nickP.className = "text-sm tracking-tight";
        nickP.textContent = user.nickname;
        const refP = document.createElement('p');
        refP.className = "text-[10px] text-slate-500 mono uppercase";
        refP.textContent = `${user.account.split(' ')[0]}_REF`;
        
        infoDiv.appendChild(nickP);
        infoDiv.appendChild(refP);
        tdUser.appendChild(avatarContainer);
        tdUser.appendChild(infoDiv);

        // Coluna Bio
        const tdBio = document.createElement('td');
        tdBio.className = "px-8 py-5 text-slate-400 text-xs italic max-w-xs truncate";
        tdBio.textContent = user.background || "Sistema operacional ativo.";

        // Coluna Ação
        const tdAction = document.createElement('td');
        tdAction.className = "px-8 py-5 text-right";
        const btn = document.createElement('button');
        btn.className = "px-5 py-2 bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/20";
        btn.textContent = "Monitorar";
        btn.onclick = () => verDetalhesUsuario(user.number);
        tdAction.appendChild(btn);

        tr.appendChild(tdUser);
        tr.appendChild(tdBio);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    });
}

async function executarBuscaGlobal(termo) {
    const container = document.getElementById('detalhes-container');
    const viewTabela = document.getElementById('view-tabela');
    
    try {
        const res = await fetch(`${API_BASE_URL}/usuario/busca?busca=${termo}`);
        const result = await res.json();
        
        if (result.status && result.dadosBusca) {
            viewTabela.classList.add('opacity-0', 'pointer-events-none');
            container.classList.remove('hidden');
            container.classList.add('flex');
            
            renderizarMensagens(result.dadosBusca.resultados);
            document.getElementById('user-detail-name').textContent = `BUSCA: "${termo}"`;
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    }
}

async function verDetalhesUsuario(numero) {
    const container = document.getElementById('detalhes-container');
    const viewTabela = document.getElementById('view-tabela');

    viewTabela.classList.add('opacity-0', 'pointer-events-none');
    
    try {
        const resContatos = await fetch(`${API_BASE_URL}/usuario/contatos?numero=${numero}`);
        const resultContatos = await resContatos.json();
        
        if (resultContatos.status) {
            const dados = resultContatos.dadosContatos;
            document.getElementById('user-detail-name').textContent = dados.dadosUsuario[0].usuario;
            document.getElementById('user-detail-number').textContent = `ID_NODE: ${numero}`;
            
            renderizarContatos(dados.dadosUsuario, numero);
            container.classList.remove('hidden');
            container.classList.add('flex');
        }
    } catch (error) {
        console.error("Falha ao abrir detalhes:", error);
    }
}

function renderizarMensagens(mensagens) {
    const log = document.getElementById('log-mensagens');
    log.textContent = ""; 

    if (!mensagens || mensagens.length === 0) {
        const empty = document.createElement('div');
        empty.className = "text-center py-20 text-slate-600 mono text-xs uppercase tracking-widest";
        empty.textContent = "NENHUM_LOG_ENCONTRADO";
        log.appendChild(empty);
        return;
    }

    mensagens.forEach(m => {
        const remetente = m.remetente || m.usuarioDono || m.usuarioRemetente || "SISTEMA";
        const texto = m.mensagem || m.mensagensTrocadas || m.conteudo || "Vazio";
        const horario = m.horarioEnvio || m.horarioDoEnvio || m.horario || "00:00";
        const isMe = remetente.toLowerCase() === "me" || remetente.includes("Costa");

        const msgDiv = document.createElement('div');
        msgDiv.className = `p-4 rounded-2xl border-l-4 transition-all mb-4 ${isMe ? 'border-purple-500 bg-purple-500/5' : 'border-blue-500 bg-blue-500/5'}`;
        
        const meta = document.createElement('div');
        meta.className = "flex justify-between items-center mb-1 opacity-50 font-black text-[9px] tracking-widest uppercase";
        
        const senderSpan = document.createElement('span');
        senderSpan.className = isMe ? 'text-purple-400' : 'text-blue-400';
        senderSpan.textContent = remetente;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = "mono";
        timeSpan.textContent = horario;

        const contentP = document.createElement('p');
        contentP.className = "text-slate-200 text-sm leading-relaxed";
        contentP.textContent = texto;

        meta.appendChild(senderSpan);
        meta.appendChild(timeSpan);
        msgDiv.appendChild(meta);
        msgDiv.appendChild(contentP);
        log.appendChild(msgDiv);
    });
}

function fecharDetalhes() {
    const viewTabela = document.getElementById('view-tabela');
    const containerDetalhes = document.getElementById('detalhes-container');
    
    containerDetalhes.classList.add('animate__fadeOutDown');
    setTimeout(() => {
        containerDetalhes.classList.add('hidden');
        containerDetalhes.classList.remove('animate__fadeOutDown', 'flex');
        viewTabela.classList.remove('opacity-0', 'pointer-events-none');
    }, 400);
}

function renderizarContatos(contatos, numeroDono) {
    const lista = document.getElementById('lista-contatos-detalhe');
    lista.textContent = ""; 

    contatos.forEach(c => {
        const li = document.createElement('li');
        li.className = "flex items-center gap-3 p-3 bg-white/5 hover:bg-purple-500/10 rounded-xl border border-white/5 cursor-pointer transition-all group";
        li.onclick = () => carregarConversaDireta(numeroDono, c.nomeContato);

        const img = document.createElement('img');
        img.src = c.imagemContato;
        img.className = "w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-purple-500/50";
        
        const textContainer = document.createElement('div');
        textContainer.className = "flex-1 overflow-hidden";
        const nome = document.createElement('p');
        nome.className = "text-xs text-white font-bold truncate";
        nome.textContent = c.nomeContato;
        const bio = document.createElement('p');
        bio.className = "text-[10px] text-slate-500 truncate";
        bio.textContent = c.bioContato;

        textContainer.appendChild(nome);
        textContainer.appendChild(bio);
        li.appendChild(img);
        li.appendChild(textContainer);
        lista.appendChild(li);
    });
}

async function carregarConversaDireta(numeroUsuario, nomeContato) {
    const statusTxt = document.getElementById('status-conversa');
    if (statusTxt) statusTxt.textContent = `LINHA_ATIVA: ${nomeContato.toUpperCase()}`;

    try {
        const res = await fetch(`${API_BASE_URL}/usuario/conversa/direta?numero=${numeroUsuario}&contato=${nomeContato}`);
        const result = await res.json();
        
        if (result.status && result.dadosConversaDireta) {
            renderizarMensagens(result.dadosConversaDireta.mensagensUsuario);
        }
    } catch (error) {
        console.error("Erro no filtro de conversa:", error);
    }
}

function exibirErroTabela() {
    const tbody = document.getElementById('corpo-tabela');
    tbody.textContent = "Falha crítica na comunicação com o servidor.";
}

// Global para o HTML
window.fecharDetalhes = fecharDetalhes;
window.verDetalhesUsuario = verDetalhesUsuario;
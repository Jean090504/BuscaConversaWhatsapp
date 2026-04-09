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

        // AJUSTE: Suas rotas retornam "status" como string e os dados dentro de "dados"
        // E dentro de "dados", existe a chave "dadosUsuario"
        if (result.status === "true" && result.dados && result.dados.dadosUsuario) {
            const users = result.dados.dadosUsuario; 
            
            const totalEl = document.getElementById('total-contatos');
            if (totalEl) totalEl.textContent = users.length;

            renderizarTabela(users);
        }
    } catch (error) {
        console.error("Erro na carga inicial:", error);
        exibirErroTabela();
    }
}

function renderizarTabela(usuarios) {
    const tbody = document.getElementById('corpo-tabela');
    tbody.textContent = ""; 

    usuarios.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-800/50 transition border-b border-slate-700/50";

        const tdUser = document.createElement('td');
        tdUser.className = "px-6 py-4 flex items-center gap-3 text-white";
        
        const img = document.createElement('img');
        // Usamos profile-image conforme sua API
        img.src = user["profile-image"]; 
        img.className = "w-8 h-8 rounded-full bg-slate-700 border border-slate-600 object-cover";
        
        const spanName = document.createElement('span');
        spanName.textContent = user.nickname;
        
        tdUser.appendChild(img);
        tdUser.appendChild(spanName);

        const tdBio = document.createElement('td');
        tdBio.className = "px-6 py-4 italic text-slate-400";
        tdBio.textContent = user.background || "Sem descrição.";

        const tdAction = document.createElement('td');
        tdAction.className = "px-6 py-4";
        const btn = document.createElement('button');
        btn.className = "text-indigo-400 hover:text-indigo-300 font-medium transition-colors";
        btn.textContent = "Ver Detalhes";
        btn.onclick = () => verDetalhesUsuario(user.number);

        tdAction.appendChild(btn);
        tr.appendChild(tdUser);
        tr.appendChild(tdBio);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    });
}

// Função para abrir detalhes sem quebrar o layout
async function verDetalhesUsuario(numero) {
    const viewTabela = document.getElementById('view-tabela');
    const containerDetalhes = document.getElementById('detalhes-container');

    // Transição visual
    viewTabela.classList.add('opacity-0', 'pointer-events-none');
    
    try {
        // Busca de dados (mantendo sua lógica de 09/04/2026)
        const resContatos = await fetch(`${API_BASE_URL}/usuario/contatos?numero=${numero}`);
        const resultContatos = await resContatos.json();
        
        if (resultContatos.status) {
            // Preenche o cabeçalho com os dados do dono
            document.getElementById('user-detail-name').textContent = resultContatos.dadosContatos.dadosUsuario[0].usuario;
            document.getElementById('user-detail-number').textContent = `NODE_REF: ${numero}`;
            
            renderizarContatos(resultContatos.dadosContatos.dadosUsuario, numero);
            
            // Abre o container
            containerDetalhes.classList.remove('hidden');
            containerDetalhes.classList.add('flex'); // Garante que o grid flexível funcione
        }
    } catch (error) {
        console.error("Erro ao processar requisição:", error);
    }
}

// --- 5. BUSCA POR PALAVRA-CHAVE (ENDPOINT 19) ---
const inputBusca = document.getElementById('input-busca-global');
inputBusca?.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const termo = inputBusca.value;
        const container = document.getElementById('detalhes-container');
        container.classList.remove('hidden');
        
        try {
            const res = await fetch(`${API_BASE_URL}/usuario/busca?busca=${termo}`);
            const result = await res.json();
            
            if (result.status) {
                renderizarMensagensBusca(result.dadosBusca.resultados);
                document.getElementById('user-detail-name').textContent = `Resultados para: "${termo}"`;
            }
        } catch (error) {
            console.error("Erro na busca:", error);
        }
    }
});

// --- 6. FILTRO DE CONVERSA DIRETA (ENDPOINT 15) ---
async function carregarConversaDireta(numeroUsuario, nomeContato) {
    const statusTxt = document.getElementById('status-conversa');
    if (statusTxt) statusTxt.textContent = `Filtrando conversa com: ${nomeContato}`;

    try {
        const res = await fetch(`${API_BASE_URL}/usuario/conversa/direta?numero=${numeroUsuario}&contato=${nomeContato}`);
        const result = await res.json();
        
        if (result.status && result.dadosConversaDireta) {
            renderizarMensagens(result.dadosConversaDireta.mensagensUsuario);
        }
    } catch (error) {
        console.error("Erro ao filtrar conversa:", error);
    }
}

// Atualize sua função renderizarContatos para tornar os itens clicáveis
function renderizarContatos(contatos, numeroDono) {
    const lista = document.getElementById('lista-contatos-detalhe');
    lista.textContent = ""; 

    contatos.forEach(c => {
        const li = document.createElement('li');
        // Cursor pointer e hover para indicar que é clicável
        li.className = "flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 mb-2 cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all group";
        
        // Ao clicar, puxa a conversa direta (Endpoint 15)
        li.onclick = () => carregarConversaDireta(numeroDono, c.nomeContato);

        li.innerHTML = `
            <img src="${c.imagemContato}" class="w-10 h-10 rounded-full object-cover border border-slate-600 group-hover:border-indigo-500 transition-all">
            <div class="flex-1">
                <p class="text-xs text-white font-bold group-hover:text-indigo-400 transition-all">${c.nomeContato}</p>
                <p class="text-[10px] text-slate-500 leading-tight truncate w-32">${c.bioContato}</p>
            </div>
            <i class="fas fa-chevron-right text-[10px] text-slate-700 group-hover:text-indigo-500 transition-all"></i>
        `;
        lista.appendChild(li);
    });
}



// Função para fechar e restaurar o Dashboard
function fecharDetalhes() {
    const viewTabela = document.getElementById('view-tabela');
    const containerDetalhes = document.getElementById('detalhes-container');

    containerDetalhes.classList.add('animate__fadeOut');
    setTimeout(() => {
        containerDetalhes.classList.add('hidden');
        containerDetalhes.classList.remove('animate__fadeOut', 'flex');
        viewTabela.classList.remove('opacity-0', 'pointer-events-none');
    }, 400);
}

function renderizarMensagens(mensagens) {
    const log = document.getElementById('log-mensagens');
    log.textContent = ""; 

    mensagens.forEach(m => {
        const msgDiv = document.createElement('div');
        msgDiv.className = "p-4 rounded-xl border-l-4 transition-all hover:bg-slate-800/40 " + 
                          (m.remetente === m.usuario ? "border-indigo-500 bg-indigo-500/5" : "border-slate-600 bg-slate-800/20");
        
        const meta = document.createElement('div');
        meta.className = "flex justify-between items-center mb-2 opacity-60 uppercase font-bold text-[9px] tracking-widest";
        
        const sender = document.createElement('span');
        sender.className = m.remetente === m.usuario ? "text-indigo-400" : "text-slate-400";
        sender.textContent = m.remetente;

        const time = document.createElement('span');
        time.className = "mono";
        time.textContent = m.horarioDoEnvio;

        const content = document.createElement('p');
        content.className = "text-slate-200 text-sm leading-relaxed";
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
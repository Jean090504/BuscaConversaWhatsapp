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
        tr.className = "hover:bg-slate-50 transition-colors"; // Fundo claro no hover

        const tdUser = document.createElement('td');
        tdUser.className = "px-6 py-4 flex items-center gap-3 text-slate-800 font-medium";
        
        const img = document.createElement('img');
        img.src = user["profile-image"]; 
        img.className = "w-9 h-9 rounded-full bg-slate-200 border border-slate-200 object-cover";
        
        const spanName = document.createElement('span');
        spanName.textContent = user.nickname;
        
        tdUser.appendChild(img);
        tdUser.appendChild(spanName);

        const tdBio = document.createElement('td');
        tdBio.className = "px-6 py-4 text-slate-500 text-xs italic";
        tdBio.textContent = user.background || "Nenhuma descrição disponível.";

        const tdAction = document.createElement('td');
        tdAction.className = "px-6 py-4 text-right";
        const btn = document.createElement('button');
        btn.className = "px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all";
        btn.textContent = "Detalhes";
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

function renderizarContatos(contatos, numeroDono) {
    const lista = document.getElementById('lista-contatos-detalhe');
    lista.textContent = ""; 

    contatos.forEach(c => {
        const li = document.createElement('li');
        li.className = "flex items-center gap-3 p-3 bg-white hover:bg-indigo-50 rounded-xl border border-slate-100 cursor-pointer transition-all group";
        li.onclick = () => carregarConversaDireta(numeroDono, c.nomeContato);

        const img = document.createElement('img');
        img.src = c.imagemContato;
        img.className = "w-10 h-10 rounded-lg object-cover border border-slate-200";
        
        const textContainer = document.createElement('div');
        textContainer.className = "flex-1 overflow-hidden";

        const nome = document.createElement('p');
        nome.className = "text-[12px] text-slate-800 font-bold truncate";
        nome.textContent = c.nomeContato;

        const bio = document.createElement('p');
        bio.className = "text-[10px] text-slate-400 truncate";
        bio.textContent = c.bioContato;

        textContainer.appendChild(nome);
        textContainer.appendChild(bio);

        li.appendChild(img);
        li.appendChild(textContainer);
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
        const souEu = m.remetente === m.usuario;
        
        // Estilo de balão de chat moderno
        msgDiv.className = "max-w-[85%] p-3 rounded-2xl shadow-sm text-sm " + 
                          (souEu ? "bg-indigo-600 text-white ml-auto rounded-tr-none" : "bg-white text-slate-700 mr-auto rounded-tl-none border border-slate-200");
        
        const meta = document.createElement('div');
        meta.className = "flex justify-between items-center mb-1 text-[9px] font-bold uppercase tracking-wider opacity-70";
        
        const sender = document.createElement('span');
        sender.textContent = m.remetente;

        const time = document.createElement('span');
        time.textContent = m.horarioDoEnvio;

        meta.appendChild(sender);
        meta.appendChild(time);

        const content = document.createElement('p');
        content.className = "leading-relaxed";
        content.textContent = m.mensagensTrocadas;

        msgDiv.appendChild(meta);
        msgDiv.appendChild(content);
        log.appendChild(msgDiv);
    });
}

function renderizarMensagensBusca(resultados) {
    const log = document.getElementById('log-mensagens');
    log.textContent = ""; 

    if (!resultados || resultados.length === 0) {
        const mensagemErro = document.createElement('p');
        mensagemErro.className = "p-4 text-slate-500 italic text-center";
        mensagemErro.textContent = "Nenhuma mensagem encontrada para este termo.";
        log.appendChild(mensagemErro);
        return;
    }

    resultados.forEach(res => {
        // 1. Criar o container principal da mensagem
        const msgDiv = document.createElement('div');
        msgDiv.className = "p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/5 mb-3 transition-all hover:bg-slate-800/40";
        
        // 2. Criar o cabeçalho (Meta info)
        const metaDiv = document.createElement('div');
        metaDiv.className = "flex justify-between items-center mb-2 opacity-60 uppercase font-bold text-[9px] tracking-widest";
        
        const infoUsuarios = document.createElement('span');
        infoUsuarios.className = "text-emerald-400";
        infoUsuarios.textContent = `De: ${res.usuarioRemetente} para ${res.usuarioDestinatario}`;
        
        const infoData = document.createElement('span');
        infoData.className = "mono";
        infoData.textContent = `${res.horario} - ${res.data}`;
        
        metaDiv.appendChild(infoUsuarios);
        metaDiv.appendChild(infoData);
        
        // 3. Criar o corpo da mensagem
        const conteudoMensagem = document.createElement('p');
        conteudoMensagem.className = "text-slate-200 text-sm leading-relaxed";
        conteudoMensagem.textContent = res.conteudo;
        
        // 4. Montar a estrutura
        msgDiv.appendChild(metaDiv);
        msgDiv.appendChild(conteudoMensagem);
        
        // 5. Adicionar ao Log principal
        log.appendChild(msgDiv);
    });
}


function exibirErroTabela() {
    const tbody = document.getElementById('corpo-tabela');
    tbody.textContent = "Erro na comunicação com o servidor Render.";
}

document.addEventListener('DOMContentLoaded', inicializarDashboard);
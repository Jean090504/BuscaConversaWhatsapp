const API_URL = 'https://sistema-de-conversas-app.onrender.com/v1/whatsapp/usuarios/dados';

async function fetchAnalytics() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status) {
            const tabela = document.getElementById('corpo-tabela');
            document.getElementById('total-contatos').innerText = data.users.length;

            tabela.innerHTML = ''; // Limpa a tabela
            
            data.users.forEach(user => {
                tabela.innerHTML += `
                    <tr class="hover:bg-slate-800/50 transition">
                        <td class="px-6 py-4 flex items-center gap-3 text-white">
                            <img src="${user.image}" class="w-8 h-8 rounded bg-slate-700 border border-slate-600">
                            ${user.nickname}
                        </td>
                        <td class="px-6 py-4 italic text-slate-400">${user.bio}</td>
                        <td class="px-6 py-4">
                            <button class="text-indigo-400 hover:text-indigo-300 font-medium">Ver Logs</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error("Erro na carga de dados:", error);
    }
}

fetchAnalytics();
const tabela = document.querySelector(".tabela-chamados tbody");
const btnAdicionar = document.getElementById("adicionar");

// carregar dados do localStorage
let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
renderTabela();

btnAdicionar.addEventListener("click", () => {
    const dataInput = document.getElementById('data').value;
    const chamado = document.getElementById('chamado').value;
    const hora = document.getElementById('hora').value;
    const local = document.getElementById('local').value;

    if (!dataInput || !chamado || !hora || !local) {
        alert("Preencha todos os campos!");
        return;
    }

    if (!/^\d{6}$/.test(chamado)) {
        alert("O número do chamado deve ter exatamente 6 dígitos!");
        return;
    }

    // formatar data: de "2025-08-19" para "19 Ago"
    const dataObj = new Date(dataInput);
    const opcoes = { day: "2-digit", month: "short" };
    const dataFormatada = dataObj.toLocaleDateString("pt-BR", opcoes);

    // 🔎 buscar dados na base
    const dadosBase = buscarDadosNaBase(chamado);

    const novoChamado = {
        data: dataFormatada,
        chamado,
        hora,
        local,
        motivo: dadosBase?.MOTIVO || "Não encontrado",
        status: dadosBase?.ESTADO || "Não encontrado"
    };

    chamados.push(novoChamado);

    salvar();
    renderTabela();

    // limpar os campos
    document.getElementById('data').value = "";
    document.getElementById('chamado').value = "";
    document.getElementById('hora').value = "";
    document.getElementById('local').value = "";
});

// função para buscar dados (MOTIVO + STATUS) no localStorage da base
function buscarDadosNaBase(numeroChamado) {
    let dadosSalvos = localStorage.getItem("dadosTabela");
    if (!dadosSalvos) return null;

    let dados = JSON.parse(dadosSalvos);
    return dados.find(item => String(item.CHAMADO) === String(numeroChamado)) || null;
}

// renderiza tabela
function renderTabela() {
    tabela.innerHTML = "";
    chamados.forEach((c, index) => {
        const tr = document.createElement("tr");

        // cor do status
        let cor = "";
        if (c.status === "AGUARDANDO CLIENTE") cor = "red";
        if (c.status === "EM ATENDIMENTO") cor = "orange";
        if (c.status === "FECHADO") cor = "green";
        if (c.status === "Não encontrado") cor = "gray";

        tr.innerHTML = `
            <td>
              ${c.data} 
              <span class="lixeira" onclick="excluir(${index})">🗑️</span>
            </td>
            <td>${c.chamado}</td>
            <td>${c.hora}</td>
            <td>${c.local}</td>
            <td>
                <div style="white-space:nowrap; overflow-x:auto; max-width:200px;">
                    ${c.motivo}
                </div>
            </td>
            <td style="color:${cor}">${c.status}</td>
        `;
        tabela.appendChild(tr);
    });
}

function atualizarMotivo(index, valor) {
    chamados[index].motivo = valor;
    salvar();
}

// salva no localStorage
function salvar() {
    localStorage.setItem("chamados", JSON.stringify(chamados));
}

// excluir item
function excluir(index) {
    chamados.splice(index, 1);
    salvar();
    renderTabela();
}

window.excluir = excluir;

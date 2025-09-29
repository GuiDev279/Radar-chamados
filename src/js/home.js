const tabela = document.querySelector(".tabela-chamados tbody");
const btnAdicionar = document.getElementById("adicionar");
const menuHum = document.querySelector(".menu-hum")
const menu = document.querySelector(".menu")
const btnAdicionarChamados = document.querySelector('.adicionar-chamados');
const menuAdicionar = document.querySelector('.tabela-container');
const btnFechar = document.getElementById('fechar');
const engrenagem = document.querySelector('.ark');
const contadores = document.getElementById('contadores');

document.addEventListener("DOMContentLoaded", () => {
    engrenagem.addEventListener("click", () => {
        console.log('clicou')

        contadores.classList.toggle('ativo')
    })
});

document.addEventListener("DOMContentLoaded", () => {
    btnAdicionarChamados.addEventListener('click', () => {
        menuAdicionar.classList.add('ativo');
        btnAdicionarChamados.style.display = 'none';
    });
});

btnFechar.addEventListener('click', () => {
    menuAdicionar.classList.remove('ativo');
    btnAdicionarChamados.style.display = 'block';
})




let timeout;
const tempoInatividade = 10 * 60 * 1000;

function resetarTime() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        alert('Sua sessão expirou por inatividade.');
        window.location.href = "index.html";
    }, tempoInatividade);
}

window.onload = resetarTime;
document.onmousemove = resetarTime;
document.onkeypress = resetarTime;
document.onclick = resetarTime;
document.onscroll = resetarTime;

resetarTime()

menuHum.addEventListener("click", () => {
    menu.classList.toggle("ativo")
})

// carregar dados do localStorage
let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
renderTabela();
atualizarChamadosComBase();

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
    const [ano, mes, dia] = dataInput.split("-");
    const dataObj = new Date(ano, mes - 1, dia); // aqui já cria no fuso local corretamente

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

    // ordenar por hora (HH:mm)
    chamados.sort((a, b) => {
        const [ha, ma] = a.hora.split(":").map(Number);
        const [hb, mb] = b.hora.split(":").map(Number);

        if (ha !== hb) return ha - hb;
        return ma - mb;
    });

    salvar();
    renderTabela();
    contarStatus();

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
    const filtro = document.getElementById("filtro").value;
    chamados.forEach((c, index) => {
        let mostrar = true;

        // aplica filtro
        if (filtro === "aguardando" && c.status !== "AGUARDANDO CLIENTE") mostrar = false;
        if (filtro === "atendimento" && c.status !== "EM ATENDIMENTO") mostrar = false;
        if (filtro === "abertos" && !(c.status === "AGUARDANDO CLIENTE" || c.status === "EM ATENDIMENTO")) mostrar = false;
        if (filtro === "fechado" && c.status !== "FECHADO") mostrar = false;
        if (filtro === "naoencontrado" && c.status !== "Não encontrado") mostrar = false;

        if (mostrar) {
            const tr = document.createElement("tr");
            tr.classList.add("nova-linha");

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
        }


    });
    contarStatus();
}
document.getElementById("filtro").addEventListener("change", renderTabela);

function contarStatus() {
    const statusCells = document.querySelectorAll(".tabela-chamados tbody tr td:last-child");

    let aguardando = 0;
    let atendimento = 0;
    let fechado = 0;

    statusCells.forEach(cell => {
        const texto = cell.textContent.trim().toUpperCase();

        if (texto === "AGUARDANDO CLIENTE") {
            aguardando++;
        } else if (texto === "EM ATENDIMENTO") {
            atendimento++;
        } else if (texto === "FECHADO") {
            fechado++;
        }
    });

    let agendados = JSON.parse(localStorage.getItem("agendados")) || [];
    let qtdAgendados = agendados.length;

    document.getElementById("aguardando").textContent = aguardando;
    document.getElementById("atendimento").textContent = atendimento;
    document.getElementById("agendado").textContent = qtdAgendados
    document.getElementById("fechado").textContent = fechado;

    const total = qtdAgendados + aguardando;
    document.getElementById("total").textContent = total;
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
    contarStatus();
    alert("Chamado excluído com sucesso!");
}

function atualizarChamadosComBase() {
    let dadosSalvos = localStorage.getItem("dadosTabela");
    if (!dadosSalvos) return;

    let dadosBase = JSON.parse(dadosSalvos);

    chamados.forEach(chamado => {
        const encontrado = dadosBase.find(item => String(item.CHAMADO) === String(chamado.chamado));
        if (encontrado) {
            chamado.motivo = encontrado.MOTIVO;
            chamado.status = encontrado.ESTADO;
        }
    });

    salvar();
    renderTabela();
    contarStatus();
}

document.getElementById("exportar").addEventListener("click", exportarExcel);

function exportarExcel() {
    if (chamados.length === 0) {
        alert("Nenhum chamado para exportar!");
        return;
    }

    // transforma em planilha
    const ws = XLSX.utils.json_to_sheet(chamados);

    // cria um workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chamados");

    // baixa arquivo
    XLSX.writeFile(wb, "status_chamados.xlsx");
}

document.getElementById("excluirFechados").addEventListener("click", excluirFechados);

function excluirFechados() {
    const confirmacao = confirm("Deseja realmente excluir todos os chamados fechados?");
    if (!confirmacao) return;

    // mantém apenas os que não estão fechados
    chamados = chamados.filter(c => c.status !== "FECHADO");

    salvar();
    renderTabela();
    contarStatus();

    alert("Todos os chamados fechados foram excluídos!");
}

// pega o contador da aba agendados e atualiza na aba home

window.addEventListener("storage", (event) => {
    if (event.key === "agendados") {
        contarStatus(); // recalcula os contadores assim que a lista for alterada
    }
});


window.excluir = excluir;

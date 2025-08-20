// função para preencher a tabela a partir de um array de objetos
function preencherTabela(dados) {
    const tbody = document.querySelector(".tabela tbody");

    // efeito fade out antes de limpar
    tbody.style.opacity = 0;

    setTimeout(() => {
        tbody.innerHTML = ""; // limpa linhas antigas

        const colunas = ["CHAMADO", "NOME", "ABERTURA", "ULTIMA AÇÃO", "FECHAMENTO", "ESTADO", "MOTIVO"];

        dados.forEach(row => {
            const tr = document.createElement("tr");
            colunas.forEach(col => {
                const td = document.createElement("td");
                td.textContent = row[col] || "";
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        // fade in dos novos dados
        tbody.style.opacity = 1;
    }, 150); // tempo do fade out
}

// função para processar o arquivo Excel e atualizar a tabela
function processarExcel(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // salva os novos dados no localStorage
        localStorage.setItem("dadosTabela", JSON.stringify(rows));

        // preenche a tabela com efeito
        preencherTabela(rows);
    };

    reader.readAsArrayBuffer(file);
}

// evento quando o usuário escolhe um arquivo
document.getElementById('inputExcel').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    processarExcel(file);
});

// ao carregar a página, preenche a tabela com dados salvos (se houver)
window.addEventListener("DOMContentLoaded", () => {
    const dadosSalvos = localStorage.getItem("dadosTabela");
    if (dadosSalvos) {
        preencherTabela(JSON.parse(dadosSalvos));
    }
});

// busca um chamado específico
function buscarChamado(numeroChamado) {
    const dadosSalvos = localStorage.getItem("dadosTabela");
    if (!dadosSalvos) return null;

    const dados = JSON.parse(dadosSalvos);
    return dados.find(item => String(item.CHAMADO) === String(numeroChamado));
}

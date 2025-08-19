// função para preencher a tabela a partir de um array de objetos
function preencherTabela(dados) {
    let tbody = document.querySelector(".tabela tbody");
    tbody.innerHTML = "";

    let colunas = ["CHAMADO", "NOME", "ABERTURA", "ULTIMA AÇÃO", "FECHAMENTO", "ESTADO", "MOTIVO"];

    dados.forEach(row => {
        let tr = document.createElement("tr");
        colunas.forEach(col => {
            let td = document.createElement("td");
            td.textContent = row[col] || "";
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// quando escolher um arquivo Excel
document.getElementById('inputExcel').addEventListener('change', function (e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });

        let sheetName = workbook.SheetNames[0];
        let sheet = workbook.Sheets[sheetName];

        // converte para JSON
        let rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // salva no localStorage
        localStorage.setItem("dadosTabela", JSON.stringify(rows));

        // preenche a tabela
        preencherTabela(rows);
    };

    reader.readAsArrayBuffer(file);
});

// quando a página carregar, recupera do localStorage
window.addEventListener("DOMContentLoaded", () => {
    let dadosSalvos = localStorage.getItem("dadosTabela");
    if (dadosSalvos) {
        preencherTabela(JSON.parse(dadosSalvos));
    }
});

// procura um chamado específico e retorna os dados
function buscarChamado(numeroChamado) {
    let dadosSalvos = localStorage.getItem("dadosTabela");
    if (!dadosSalvos) return null;

    let dados = JSON.parse(dadosSalvos);
    return dados.find(item => String(item.CHAMADO) === String(numeroChamado));
}


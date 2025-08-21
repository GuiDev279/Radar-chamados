const btnAdd = document.getElementById("btn-add");
const tabelaEstoque = document.querySelector(".tabela-estoque tbody");

// carrega estoque salvo no localStorage
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];

// renderiza a tabela com os dados
function renderTabela() {
  tabelaEstoque.innerHTML = "";

  estoque.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.serial}</td>
      <td>${item.patrimonio}</td>
      <td>${item.legado}</td>
      <td>${item.data}</td>
      <td>${item.tipo}</td>
      <td>${item.marca}</td>
      <td>${item.modelo}</td>
      <td>${item.condicao}</td>
      <td>${item.nf}</td>
      <td>${item.matricula}</td>
      <td>
        ${item.status}
        <button class="btn-excluir" data-index="${index}" title="Excluir">
          🗑️
        </button>
      </td>
      
    `;
    tabelaEstoque.appendChild(tr);
  });

  // adiciona evento nos botões de excluir
  document.querySelectorAll(".btn-excluir").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const i = e.target.getAttribute("data-index");
      estoque.splice(i, 1); // remove do array
      salvarEstoque();
      renderTabela();
    });
  });
}

// salva no localStorage
function salvarEstoque() {
  localStorage.setItem("estoque", JSON.stringify(estoque));
}

// adicionar item
btnAdd.addEventListener("click", () => {
  const item = {
    serial: document.getElementById("serial").value,
    patrimonio: document.getElementById("patrimonio").value,
    legado: document.getElementById("legado").value,
    data: document.getElementById("data").value,
    tipo: document.getElementById("tipo").value,
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    condicao: document.getElementById("condicao").value,
    nf: document.getElementById("nf").value,
    matricula: document.getElementById("matricula").value,
    status: document.getElementById("status").value
  };

  // adiciona no array
  estoque.push(item);

  // salva e renderiza
  salvarEstoque();
  renderTabela();

  // limpa inputs
  document.querySelectorAll(".add-manual input, .add-manual select")
    .forEach(el => el.value = "");
});
const uploadInput = document.getElementById("upload");

uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // pega a primeira aba da planilha
    const primeiraAba = workbook.SheetNames[0];
    const sheet = workbook.Sheets[primeiraAba];

    // converte para JSON
    const dados = XLSX.utils.sheet_to_json(sheet);

    /*
      IMPORTANTE ⚠️
      Os nomes das colunas da planilha precisam bater com:
      SERIAL, PATRIMONIO, LEGADO, DATA, TIPO, MARCA, MODELO, CONDIÇÃO, NF, MATRICULA, STATUS
    */

    dados.forEach(item => {
      estoque.push({
        serial: item.SERIAL || "",
        patrimonio: item.PATRIMONIO || "",
        legado: item.LEGADO || "",
        data: item.DATA || "",
        tipo: item.TIPO || "",
        marca: item.MARCA || "",
        modelo: item.MODELO || "",
        condicao: item["CONDIÇÃO"] || "",
        nf: item.NF || "",
        matricula: item.MATRICULA || "",
        status: item.STATUS || ""
      });
    });

    salvarEstoque();
    renderTabela();
  };

  reader.readAsArrayBuffer(file);
});


// inicializa tabela ao carregar
renderTabela();

const btnAdd = document.getElementById("btn-add");
const tabelaEstoque = document.querySelector(".tabela-estoque tbody");
const btnCadastro = document.querySelector(".cadastrar")
const tabelaManual = document.querySelector(".add-manual")
const tabelaPerifericos = document.getElementById("perifericos")


btnCadastro.addEventListener('click', () => {
   tabelaManual.classList.toggle("ativo")
})

// carrega estoque salvo no localStorage
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];

// renderiza a tabela com os dados
function renderTabela() {
  tabelaEstoque.innerHTML = "";

  estoque.forEach((item, index) => {

    let dataFormatada = "";
    if (item.data) {
      const partes = item.data.split("-"); // ["aaaa","mm","dd"]
      if (partes.length === 3) {
        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }


    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.serial.toUpperCase()}</td>
      <td>${item.patrimonio.toUpperCase()}</td>
      <td>${item.legado.toUpperCase()}</td>
      <td>${dataFormatada.toUpperCase()}</td>
      <td>${item.tipo.toUpperCase()}</td>
      <td>${item.marca.toUpperCase()}</td>
      <td>${item.modelo.toUpperCase()}</td>
      <td>${item.condicao.toUpperCase()}</td>
      <td>${item.nf.toUpperCase()}</td>
      <td>${item.matricula.toUpperCase()}</td>
      <td>
        ${item.status.toUpperCase()}
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

// quando clicar no label de exportação
document.querySelector(".exportar").addEventListener("click", () => {
  if (estoque.length === 0) {
    alert("Não há dados no estoque para exportar.");
    return;
  }

  // cria a planilha a partir do estoque
  const ws = XLSX.utils.json_to_sheet(estoque);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Estoque");

  // baixa o arquivo
  XLSX.writeFile(wb, "estoque.xlsx");
});

// carrega os periféricos do localStorage
let perifericosEstoque = JSON.parse(localStorage.getItem("perifericosEstoque")) || [];

// função para salvar todos os valores atuais
function salvarPerifericos() {
  const linhas = document.querySelectorAll("#perifericos tbody tr");
  perifericosEstoque = [];

  linhas.forEach(linha => {
    const nome = linha.querySelector("td:first-child").textContent.trim();
    const quantidade = linha.querySelector("input").value || 0;

    perifericosEstoque.push({
      nome,
      quantidade: Number(quantidade)
    });
  });

  localStorage.setItem("perifericosEstoque", JSON.stringify(perifericosEstoque));
}

// função para carregar os valores salvos nos inputs
function carregarPerifericos() {
  const linhas = document.querySelectorAll("#perifericos tbody tr");

  linhas.forEach(linha => {
    const nome = linha.querySelector("td:first-child").textContent.trim();
    const input = linha.querySelector("input");

    const itemSalvo = perifericosEstoque.find(p => p.nome === nome);
    if (itemSalvo) {
      input.value = itemSalvo.quantidade;
    }

    // adiciona evento para salvar automaticamente ao alterar
    input.addEventListener("input", salvarPerifericos);
  });
}

const verPerifericos = document.getElementById("ver-perifericos")

verPerifericos.addEventListener('click', () => {
  tabelaPerifericos.classList.toggle('ver-perifericos')
})

// inicializa ao carregar a página
carregarPerifericos();



// inicializa tabela ao carregar
renderTabela();


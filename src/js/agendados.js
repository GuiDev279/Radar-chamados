const tabela = document.querySelector(".tabela-agendados tbody");
const btnAdicionar = document.getElementById("adicionar");

let agendados = JSON.parse(localStorage.getItem("agendados")) || [];
renderTabela();

btnAdicionar.addEventListener("click", () => {
  const dataInput = document.getElementById("data").value;
  const chamado = document.getElementById("chamado").value;
  const hora = document.getElementById("hora").value;
  const local = document.getElementById("local").value;

  if (!dataInput || !chamado || !hora || !local) {
    alert("Preencha todos os campos!");
    return;
  }

  if (!/^\d{6}$/.test(chamado)) {
    alert("O número do chamado deve ter exatamente 6 dígitos!");
    return;
  }

   const dataObj = new Date(dataInput);
    const opcoes = { day: "2-digit", month: "short" };
    const dataFormatada = dataObj.toLocaleDateString("pt-BR", opcoes);

  // Criar objeto
  const novoChamado = {
    data: dataFormatada,
    chamado: chamado,
    hora: hora,
    local: local,
    status: "AGENDADO"
  };

  // Salvar no array e localStorage
  agendados.push(novoChamado);
  localStorage.setItem("agendados", JSON.stringify(agendados));

  // Atualizar tabela
  renderTabela();

  // Limpar campos
  document.getElementById("data").value = "";
  document.getElementById("chamado").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("local").value = "";
});

function renderTabela() {
  tabela.innerHTML = ""; // limpa antes de renderizar
  agendados.forEach((item, index) => {
    const row = `
      <tr>
        <td>
            ${item.data}
            <span class="lixeira" onclick="removerChamado(${index})">🗑️</span>
        </td>
        <td>${item.chamado}</td>
        <td>${item.hora}</td>
        <td>${item.local}</td>
        <td>${item.status}</td>
      </tr>
    `;
    tabela.innerHTML += row;
  });
}

function removerChamado(index) {
  agendados.splice(index, 1);
  localStorage.setItem("agendados", JSON.stringify(agendados));
  renderTabela();
}

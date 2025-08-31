const tabela = document.querySelector(".tabela-agendados tbody");
const btnAdicionar = document.getElementById("adicionar");

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

  const [ano, mes, dia] = dataInput.split("-");
  const dataObj = new Date(ano, mes - 1, dia);
  const opcoes = { day: "2-digit", month: "short" };
  const dataFormatada = dataObj.toLocaleDateString("pt-BR", opcoes);

  // Criar objeto
  const novoChamado = {
    dataISO: dataInput, // ← formato yyyy-mm-dd (para ordenar)
    data: dataFormatada, // ← formatada para exibição
    chamado: chamado,
    hora: hora,
    local: local,
    status: "AGENDADO"
  };

  // adiciona no array
  agendados.push(novoChamado);

  // ordena por data (mais antiga → mais recente)
  agendados.sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));

  // salva no localStorage
  localStorage.setItem("agendados", JSON.stringify(agendados));

  // atualiza tabela
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

document.getElementById("exportar").addEventListener("click", exportarExcel);

function exportarExcel() {
  if (agendados.length === 0) {
    alert("Nenhum chamado para exportar!");
    return;
  }

  // transforma em planilha
  const ws = XLSX.utils.json_to_sheet(agendados);

  // cria um workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "agendados");

  // baixa arquivo
  XLSX.writeFile(wb, "status_agendados.xlsx");
}

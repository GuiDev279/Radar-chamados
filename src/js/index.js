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
    const opcoes = { day: "2-digit", month: "short" }; // dia e mês abreviado
    const dataFormatada = dataObj.toLocaleDateString("pt-BR", opcoes);

    const novoChamado = { 
        data: dataFormatada, 
        chamado, 
        hora, 
        local, 
        motivo: "", 
        status: "" 
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


// renderiza tabela
function renderTabela() {
    tabela.innerHTML = "";
    chamados.forEach((c, index) => {
        const tr = document.createElement("tr");

        // cor do status
        let cor = "";
        if (c.status === "Aberto") cor = "red";
        if (c.status === "Em atendimento") cor = "orange";
        if (c.status === "Fechado") cor = "green";

        tr.innerHTML = `
            <td>
              ${c.data} 
              <span class="lixeira" onclick="excluir(${index})">🗑️</span>
            </td>
            <td>${c.chamado}</td>
            <td>${c.hora}</td>
            <td>${c.local}</td>
            <td>
                <input class="uppercase" type="text" value="${c.motivo}" 
                       oninput="atualizarMotivo(${index}, this.value)" 
                       placeholder="Digite o motivo"
                       style="width:100%; background:transparent; border:none; outline:none;">
            </td>
            <td>
                <select onchange="atualizarStatus(${index}, this.value)" style="color:${cor}">
                    <option value="">Selecione</option>
                    <option value="Aberto" ${c.status === "Aberto" ? "selected" : ""}>Aberto</option>
                    <option value="Em atendimento" ${c.status === "Em atendimento" ? "selected" : ""}>Em atendimento</option>
                    <option value="Fechado" ${c.status === "Fechado" ? "selected" : ""}>Fechado</option>
                </select>
            </td>
        `;
        tabela.appendChild(tr);
    });
}



function atualizarStatus(index, valor) {
    chamados[index].status = valor;
    salvar();    
}

function atualizarMotivo(index, valor) {
    chamados[index].motivo = valor;
    salvar();


    // mudar a cor do select
    const select = document.querySelectorAll("select")[index];
    if (valor === "Aberto") select.style.color = "red";
    if (valor === "Em atendimento") select.style.color = "orange";
    if (valor === "Fechado") select.style.color = "green";
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

// deixa acessível no escopo global
window.excluir = excluir;

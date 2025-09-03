function login() {
    const usuario = document.getElementById('login').value
    const senha = document.getElementById('senha').value

    if (usuario === "admin" && senha === "teste") {
        localStorage.setItem('logado', 'true')
        window.location.href = "home.html";
    } else {
        document.getElementById('erro').textContent = "Usuário ou senha inválidos!";
    }

}





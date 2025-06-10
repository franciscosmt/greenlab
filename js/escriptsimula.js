// === SIMULAÇÃO COMPLETA DE UMA HORTA AUTOMATIZADA ===

// Estado simulado da irrigação
let irrigacaoLigada = false;

// Gera dados simulados de sensores
function gerarDadosSimulados() {
  return new Promise((resolve) => {
    const dadosSimulados = {
      umidade: Math.floor(Math.random() * 100),               // 0–99%
      temperatura: (Math.random() * 15 + 20).toFixed(1),       // 20.0–35.0 °C
      luminosidade: Math.floor(Math.random() * 1000),          // 0–999 lux
      irrigacaoLigada: irrigacaoLigada
    };

    // Simula atraso de resposta (como se fosse uma requisição)
    setTimeout(() => resolve(dadosSimulados), 300);
  });
}

// Atualiza a interface com dados simulados
function atualizarDados() {
  gerarDadosSimulados()
    .then(data => {
      const soil = document.getElementById("soil");
      const temperature = document.getElementById("temperature");
      const light = document.getElementById("light");
      const status = document.getElementById("status");

      if (soil) soil.textContent = `${data.umidade}%`;
      if (temperature) temperature.textContent = `${data.temperatura}°C`;
      if (light) light.textContent = `${data.luminosidade} lux`;
      if (status) status.textContent = data.irrigacaoLigada ? "Ligada" : "Desligada";
    })
    .catch(error => {
      console.error("Erro na simulação de dados:", error);
    });
}

// Alterna o estado da irrigação (simulado)
function alternarIrrigacao() {
  irrigacaoLigada = !irrigacaoLigada;
  atualizarDados();
}

// Inicializa tudo ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  // Menu responsivo (☰)
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  // Atualiza dados automaticamente a cada 5 segundos
  if (document.getElementById("soil")) {
    atualizarDados();
    setInterval(atualizarDados, 5000);
  }

  // Botão de irrigação (simulado)
  const toggleButton = document.getElementById("toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", alternarIrrigacao);
  }
});

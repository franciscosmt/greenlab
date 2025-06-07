// IP do seu ESP32 (altere conforme necessário)
const ESP32_IP = "http://192.168.1.100";

// Função para buscar dados do ESP32 e atualizar os elementos HTML (se existirem)
function atualizarDados() {
  fetch(`${ESP32_IP}/dados`)
    .then(response => response.json())
    .then(data => {
      const soil = document.getElementById("soil");
      const temperature = document.getElementById("temperature");
      const light = document.getElementById("light");
      const status = document.getElementById("status");

      if (soil) soil.textContent = `${data.umidade}%`;
      if (temperature) temperature.textContent = `${data.temperatura}°C`;
      if (light) light.textContent = data.luminosidade;
      if (status) status.textContent = data.irrigacaoLigada ? "Ligada" : "Desligada";
    })
    .catch(error => {
      console.error("Erro ao buscar dados do ESP32:", error);
    });
}

// Executa quando todo o HTML estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o menu ☰ (responsivo)
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("open"); // usa .open no CSS para mostrar/esconder o menu
    });
  }

  // Se a página tem os elementos de sensores, atualiza os dados do ESP32
  const soil = document.getElementById("soil");
  if (soil) {
    atualizarDados();
    setInterval(atualizarDados, 5000);
  }

  // Se há botão de irrigação, adiciona evento de clique
  const toggleButton = document.getElementById("toggle");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      fetch(`${ESP32_IP}/irrigacao`, {
        method: "POST"
      })
        .then(() => atualizarDados())
        .catch(error => console.error("Erro ao enviar comando de irrigação:", error));
    });
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});
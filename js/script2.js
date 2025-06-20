// ==============================
// CONTROLE DO MENU MOBILE
// ==============================

// Seleciona o botão de menu (☰ ou ×)
const menuToggle = document.querySelector('.menu-toggle');

// Seleciona o menu de navegação (<ul class="menu">)
const menu = document.querySelector('.menu');

// Verifica se os elementos existem na página
if (menuToggle && menu) {
  // Adiciona um ouvinte de clique no botão de menu
  menuToggle.addEventListener('click', () => {
    // Alterna a classe 'show' no menu (exibe/esconde no mobile)
    menu.classList.toggle('show');

    // Altera o ícone do botão entre ☰ (menu) e × (fechar)
    menuToggle.textContent = menu.classList.contains('show') ? '×' : '☰';
  });
}

// ==============================
// CONTROLE DO SISTEMA DE IRRIGAÇÃO
// ==============================

// Variável para indicar se o sistema está ativado
let sistemaLigado = false;

// Variável para indicar se a irrigação está ativada
let irrigacaoLigada = false;

// Seleciona os elementos do DOM relacionados aos sensores e à irrigação
const toggleBtn = document.getElementById("toggle");        // Botão de ligar/desligar sistema
const statusEl = document.getElementById("status");         // Elemento que mostra o status da irrigação
const soilEl = document.getElementById("soil");             // Elemento que exibe umidade do solo
const tempEl = document.getElementById("temperature");      // Elemento que exibe temperatura
const lightEl = document.getElementById("light");           // Elemento que exibe luminosidade

// Endpoint do ESP32 que retorna os dados dos sensores (modifique conforme seu endereço real)
const ESP32_ENDPOINT = "http://192.168.4.1/sensores";  // Exemplo: IP local do ESP32 + endpoint

// Verifica se os elementos existem (só existem na index.html)
if (toggleBtn && statusEl && soilEl && tempEl && lightEl) {
  // Adiciona evento ao botão de ligar/desligar o sistema
  toggleBtn.addEventListener("click", function () {
    // Alterna o estado do sistema (ligado/desligado)
    sistemaLigado = !sistemaLigado;

    // Atualiza o texto do botão
    this.textContent = sistemaLigado ? "Desligar o Sistema" : "Ligar o Sistema";

    // Reinicia o status da irrigação
    statusEl.textContent = "Desligada";
    statusEl.classList.remove("irrigacao-ligada");
    irrigacaoLigada = false;

    // Se o sistema estiver ligado, inicia a leitura dos sensores
    if (sistemaLigado) {
      atualizarSensores();
    }
  });
}

// ==============================
// FUNÇÃO PARA RECEBER DADOS REAIS DO ESP32
// ==============================

function atualizarSensores() {
  if (!sistemaLigado) return;

  // Faz uma requisição para o ESP32 para obter os dados dos sensores
  fetch(ESP32_ENDPOINT)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na conexão com ESP32");
      }
      return response.json(); // Supondo que o ESP32 envie um JSON com os dados
    })
    .then(data => {
      // Espera que o JSON tenha as propriedades: umidade, temperatura, luminosidade
      const umidade = data.umidade;
      const temperatura = data.temperatura;
      const luminosidade = data.luminosidade;

      // Atualiza os elementos HTML com os valores reais
      soilEl.textContent = `${umidade}%`;
      tempEl.textContent = `${temperatura}°C`;
      lightEl.textContent = `${luminosidade} lux`;

      // ========================
      // LÓGICA DE IRRIGAÇÃO AUTOMÁTICA
      // ========================
      if (umidade < 20 && !irrigacaoLigada) {
        irrigacaoLigada = true;
        statusEl.textContent = "Ligada (automático)";
        statusEl.classList.add("irrigacao-ligada");
      } else if (umidade > 60 && irrigacaoLigada) {
        irrigacaoLigada = false;
        statusEl.textContent = "Desligada (automático)";
        statusEl.classList.remove("irrigacao-ligada");
      }

    })
    .catch(error => {
      console.error("Erro ao obter dados do ESP32:", error);
      // Opcional: mostrar mensagem de erro na interface
    })
    .finally(() => {
      // Repetir a leitura após 3 segundos enquanto o sistema estiver ligado
      if (sistemaLigado) {
        setTimeout(atualizarSensores, 3000);
      }
    });
}

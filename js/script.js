// ==============================
// CONTROLE DO MENU MOBILE
// ==============================

// Seleciona o botão de menu (☰ ou X)
const menuToggle = document.querySelector('.menu-toggle');

// Seleciona o menu de navegação (<ul class="menu">)
const menu = document.querySelector('.menu');

// Verifica se os elementos existem na página
if (menuToggle && menu) {
  // Adiciona um ouvinte de clique no botão de menu
  menuToggle.addEventListener('click', () => {
    // Alterna a classe 'show' no menu (exibe/esconde no mobile)
    menu.classList.toggle('show');

    // Altera o ícone do botão entre ☰ (menu) e X (fechar)
    menuToggle.textContent = menu.classList.contains('show') ? 'X' : '☰';
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

    // Se o sistema estiver ligado, inicia a simulação dos sensores
    if (sistemaLigado) simularSensores();
  });
}

// ==============================
// FUNÇÃO PARA SIMULAR OS SENSORES
// ==============================

function simularSensores() {
  // Se o sistema estiver desligado, não executa
  if (!sistemaLigado) return;

  // Gera valores aleatórios simulando os sensores
  const umidade = Math.floor(Math.random() * 101);             // Umidade do solo: 0 a 100%
  const temperatura = (Math.random() * 10 + 20).toFixed(1);    // Temperatura: entre 20 e 30°C
  const luminosidade = Math.floor(Math.random() * 1001);       // Luminosidade: 0 a 1000 lux

  // Atualiza os elementos HTML com os valores simulados
  soilEl.textContent = `${umidade} %`;
  tempEl.textContent = `${temperatura} °C`;
  lightEl.textContent = `${luminosidade} lux`;

  // ========================
  // LÓGICA DE IRRIGAÇÃO AUTOMÁTICA
  // ========================

  // Se a umidade estiver baixa (< 20%) e a irrigação estiver desligada
  if (umidade < 20 && !irrigacaoLigada) {
    irrigacaoLigada = true;
    statusEl.textContent = "Ligada (automático)";
    statusEl.classList.add("irrigacao-ligada");

  // Se a umidade estiver alta (> 60%) e a irrigação estiver ligada
  } else if (umidade > 60 && irrigacaoLigada) {
    irrigacaoLigada = false;
    statusEl.textContent = "Desligada (automático)";
    statusEl.classList.remove("irrigacao-ligada");
  }

  // Chama novamente esta função após 3 segundos (loop de simulação)
  setTimeout(simularSensores, 3000);
}

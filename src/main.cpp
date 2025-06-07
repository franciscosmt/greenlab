// Código Arduino para ESP32 - Horta Automatizada
// Sensores: DHT22 (temperatura/umidade), LDR (luminosidade), bomba d'água

#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

// === Configurações da Rede Wi-Fi ===
const char* ssid = "SEU_SSID";
const char* password = "SUA_SENHA";

// === Pinos ===
#define DHTPIN 4          // Pino do sensor DHT22
#define DHTTYPE DHT22
#define LDR_PIN 34        // Pino analógico do LDR (ADC)
#define RELAY_PIN 27      // Pino digital do relé/bomba

DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);
bool irrigando = false;

// === Função para obter nível de luminosidade ===
String getLuminosidade(int valorLDR) {
  if (valorLDR > 3000) return "Alta";
  else if (valorLDR > 1500) return "Média";
  else return "Baixa";
}

void handleDados() {
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();
  int valorLDR = analogRead(LDR_PIN);
  String luminosidade = getLuminosidade(valorLDR);

  String json = "{";
  json += "\"temperatura\":" + String(temperatura, 1) + ",";
  json += "\"umidade\":" + String(umidade, 1) + ",";
  json += "\"luminosidade\":\"" + luminosidade + "\",";
  json += "\"irrigacaoLigada\":" + String(irrigando ? "true" : "false");
  json += "}";

  server.send(200, "application/json", json);
}

void handleIrrigacao() {
  irrigando = !irrigando;
  digitalWrite(RELAY_PIN, irrigando ? LOW : HIGH); // RELÉ ATIVO EM LOW
  server.send(200, "text/plain", "OK");
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Inicialmente desligado

  WiFi.begin(ssid, password);
  Serial.print("Conectando-se ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado!");
  Serial.println(WiFi.localIP());

  server.on("/dados", handleDados);
  server.on("/irrigacao", HTTP_POST, handleIrrigacao);
  server.begin();
  Serial.println("Servidor iniciado");
}

void loop() {
  server.handleClient();
}

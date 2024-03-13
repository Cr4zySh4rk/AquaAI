#include <ModbusMaster.h> // Include ModbusMaster library for communication with Modbus devices
#include <AltSoftSerial.h> // Include AltSoftSerial library for serial communication
#include <dht11.h> // Include dht11 library for interfacing with DHT11 sensor

#define NITROGEN_ADDR   0x1E // Define address of nitrogen sensor
#define PHOSPHORUS_ADDR 0x1F // Define address of phosphorus sensor
#define POTASSIUM_ADDR  0x20 // Define address of potassium sensor
#define MAX485_DE       6    // Define pin for DE (Data Enable) of MAX485
#define MAX485_RE_NEG   7    // Define pin for RE (Receiver Enable) of MAX485

AltSoftSerial swSerial; // Create AltSoftSerial object for serial communication
ModbusMaster node; // Create ModbusMaster object for Modbus communication
dht11 DHT11; // Create dht11 object for DHT11 sensor

#define DHT11PIN 5 // Define pin for DHT11 sensor
const int soil_sensor = A1; // Define analog pin for soil moisture sensor
const int relay = 4; // Define pin for relay

const long freq = 1000 * 60 * 1; // Define frequency to collect readings every 1 minute

float temp, humidity, soil_moist, N, P, K, water_ml = 0, target_moist; // Declare variables for storing sensor readings
float percentage_N, percentage_P, percentage_K; // Declare variables for storing percentage values of N, P, and K

void setup() {
  Serial.begin(9600); // Initialize serial communication at 9600 baud rate
  pinMode(MAX485_RE_NEG, OUTPUT); // Set MAX485 RE pin as output
  pinMode(MAX485_DE, OUTPUT); // Set MAX485 DE pin as output
  digitalWrite(MAX485_RE_NEG, 0); // Set RE pin low to receive data
  digitalWrite(MAX485_DE, 0); // Set DE pin low for communication
  
  swSerial.begin(9600); // Initialize AltSoftSerial at 9600 baud rate
  node.begin(1, swSerial); // Initialize ModbusMaster with slave ID 1 and AltSoftSerial
  node.preTransmission(preTransmission); // Set preTransmission function for Modbus communication
  node.postTransmission(postTransmission); // Set postTransmission function for Modbus communication

  pinMode(relay, OUTPUT); // Set relay pin as output
}

void preTransmission() {
  digitalWrite(MAX485_RE_NEG, 1); // Set RE pin high for transmission
  digitalWrite(MAX485_DE, 1); // Set DE pin high for transmission
}

void postTransmission() {
  digitalWrite(MAX485_RE_NEG, 0); // Set RE pin low after transmission
  digitalWrite(MAX485_DE, 0); // Set DE pin low after transmission
}

bool moisture_check(float current, float target) {
  return current < target; // Check if current moisture is less than target moisture
}

void start_pump() {
  digitalWrite(relay, LOW); // Turn on relay to start the pump
}

void stop_pump() {
  digitalWrite(relay, HIGH); // Turn off relay to stop the pump
}

void loop() {
  if (Serial.available() > 0) {
    target_moist = Serial.readStringUntil('\n').toFloat(); // Read target moisture value from serial input
  }
  
  int soil_analog;
  soil_analog = analogRead(soil_sensor); // Read analog value from soil moisture sensor
  float current_moist = (100 - ((soil_analog / 1023.00) * 100)); // Convert analog value to percentage moisture
  soil_moist = current_moist; // Store current moisture value
  
  bool dispense = moisture_check(current_moist, target_moist); // Check if water dispensing is needed based on moisture levels
  long pump_time = 30; // Default pump run time is 30 seconds
  if (dispense) {
    start_pump(); // Start the pump if moisture level is below target
    delay(pump_time * 1000); // Wait for pump_time seconds
    water_ml = pump_time * 0.2083; // Calculate amount of water dispensed in milliliters
    stop_pump(); // Stop the pump after dispensing water
  } else {
    water_ml = 0; // Reset water dispensed if not dispensing
    stop_pump(); // Stop the pump
  }
  
  uint8_t result;
  
  // Read nitrogen level from sensor
  result = node.readHoldingRegisters(NITROGEN_ADDR, 1);
  if (result == node.ku8MBSuccess) {
    N = node.getResponseBuffer(0x0); // Store nitrogen value in mg/kg
    float max_N = 100; // Maximum level of Nitrogen in mg/kg
    percentage_N = (N / max_N) * 100; // Calculate percentage of Nitrogen
  }
  // Read phosphorus level from sensor
  result = node.readHoldingRegisters(PHOSPHORUS_ADDR, 1);
  if (result == node.ku8MBSuccess) {
    P = node.getResponseBuffer(0x0); // Store phosphorus value in mg/kg
    float max_P = 50; // Maximum level of Phosphorus in mg/kg
    percentage_P = (P / max_P) * 100; // Calculate percentage of Phosphorus
  }
  // Read potassium level from sensor
  result = node.readHoldingRegisters(POTASSIUM_ADDR, 1);
  if (result == node.ku8MBSuccess) {
    K = node.getResponseBuffer(0x0); // Store potassium value in mg/kg
    float max_K = 80; // Maximum level of Potassium in mg/kg
    percentage_K = (K / max_K) * 100; // Calculate percentage of Potassium
  }

  int chk = DHT11.read(DHT11PIN); // Read data from DHT11 sensor
  humidity = ((float)DHT11.humidity); // Store humidity value
  temp = ((float)DHT11.temperature); // Store temperature value

  // Print sensor readings to serial monitor
  Serial.print(temp);
  Serial.print(",");
  Serial.print(humidity);
  Serial.print(",");
  Serial.print(soil_moist);
  Serial.print(",");
  Serial.print(percentage_N);
  Serial.print(",");
  Serial.print(percentage_P);
  Serial.print(",");
  Serial.print(percentage_K);
  Serial.print(",");
  Serial.println(water_ml);
  delay(1000); // Delay for 1 second
}

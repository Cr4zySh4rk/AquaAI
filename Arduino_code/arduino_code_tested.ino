//NPK Setup
#include <ModbusMaster.h>
#include <AltSoftSerial.h>
#define NITROGEN_ADDR   0x1E
#define PHOSPHORUS_ADDR 0x1F
#define POTASSIUM_ADDR  0x20
#define MAX485_DE      6
#define MAX485_RE_NEG  7
// connect DI (data in) to PIN 9
// connect R0 (data out) to PIN 8
AltSoftSerial swSerial;
ModbusMaster node;

//NPK functions below
// Put the MAX485 into transmit mode
void preTransmission()
{
  digitalWrite(MAX485_RE_NEG, 1);
  digitalWrite(MAX485_DE, 1);
}

// Put the MAX485 into receive mode
void postTransmission()
{
  digitalWrite(MAX485_RE_NEG, 0);
  digitalWrite(MAX485_DE, 0);
}

//DHT11 Temp-Humidity
#include <dht11.h>
#define DHT11PIN 5
dht11 DHT11;

//Soil moisture sensor_pin
const int soil_sensor = A1;

//Water pump relay
const int relay = 4;

const long freq = 1000 * 60 * 1; //collect the readings every 1 min, do not set freq lower than 1 min

float temp, humidity, soil_moist, N, P, K, water_ml=0,target_moist;
void setup() {
  Serial.begin(9600);
  // configure the MAX485 RE & DE control signals and enable receive mode
  pinMode(MAX485_RE_NEG, OUTPUT);
  pinMode(MAX485_DE, OUTPUT);
  digitalWrite(MAX485_RE_NEG, 0);
  digitalWrite(MAX485_DE, 0);

  // Modbus communication runs at 9600 baud
  swSerial.begin(9600);

  // Modbus slave ID of NPK sensor is 1
  node.begin(1, swSerial);

  // Callbacks to allow us to set the RS485 Tx/Rx direction
  node.preTransmission(preTransmission);
  node.postTransmission(postTransmission);
  
  //Water pump relay
  pinMode(relay, OUTPUT);
}

bool moisture_check(float current, float target) {
  if (current < target)
    return true;
  return false;
}

void start_pump() {
  digitalWrite(relay,LOW); // relay ON
}

void stop_pump() {
  digitalWrite(relay,HIGH); //relay OFF
}

void loop() {
  if (Serial.available() > 0) {
    target_moist = Serial.readStringUntil('\n').toFloat();
  }
  //Soil moisture maintence
  int soil_analog;
  soil_analog = analogRead(soil_sensor);
  float current_moist = ( 100 - ( ( soil_analog/1023.00 ) * 100 ) ); //current soil moisture in percentage
  soil_moist=current_moist;
  bool dispense = moisture_check(current_moist, target_moist);
  long pump_time = 30; // default pump rubns for 30s
  if (dispense == true) {
    // 100ml takes 8 mins to dispense or 12.5ml per min
    // for our purposes we will dispense about 6.25ml
    start_pump();
    delay(pump_time * 1000);
    water_ml = pump_time * 0.2083;
    stop_pump();
  }
  else {
    water_ml = 0;
    stop_pump();
  }
  // NPK sensor values
  uint8_t result;

  /// NITROGEN
result = node.readHoldingRegisters(NITROGEN_ADDR, 1);
if (result == node.ku8MBSuccess)
  N = node.getResponseBuffer(0x0); //values in mg/Kg (mg per Kg)

// PHOSPHORUS
result = node.readHoldingRegisters(PHOSPHORUS_ADDR, 1);
if (result == node.ku8MBSuccess)
  P = node.getResponseBuffer(0x0); //values in mg/Kg (mg per Kg)

// POTASSIUM
result = node.readHoldingRegisters(POTASSIUM_ADDR, 1);
if (result == node.ku8MBSuccess)
  K = node.getResponseBuffer(0x0); //values in mg/Kg (mg per Kg)


  //DHT sensor (temp & humidity)
  int chk = DHT11.read(DHT11PIN);
  humidity = ((float)DHT11.humidity);
  temp = ((float)DHT11.temperature);

    Serial.print(temp);
    Serial.print(",");
    Serial.print(humidity);
    Serial.print(",");
    Serial.print(soil_moist);
    Serial.print(",");
    Serial.print(N);
    Serial.print(",");
    Serial.print(P);
    Serial.print(",");
    Serial.print(K);
    Serial.print(",");
    Serial.println(water_ml);
}
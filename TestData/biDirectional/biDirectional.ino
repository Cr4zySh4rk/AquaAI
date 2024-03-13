void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    float data = Serial.readStringUntil('\n').toFloat();
    Serial.print("You sent me: ");
    Serial.println(data);
  }
}
int commande[4];
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  String msg = readData();
  if (msg != "") {
    decodePayload(msg, commande);
  
    if (commande[0] == 1)
      digitalWrite(LED_BUILTIN, HIGH);
    else 
      digitalWrite(LED_BUILTIN, LOW);
  }
  delay(50);
}

String readData() {
  String msg = "";
  if (Serial.available()) {
    delay(10);
    while (Serial.available() > 0) {
      msg += (char)Serial.read();
    }
    Serial.flush();
  }
  return msg;
}

void decodePayload(String payload, int commande[]) {
  int i = 0;

  while (i < payload.length() - 1) {
    int code = strToHex(payload.substring(i, i + 2));
    i+=2;
    switch(code) {
      case 0x01:
        commande[0] = strToHex(payload.substring(i, i + 1));
        i += 1;
        break;

      case 0x02:
        commande[1] = strToHex(payload.substring(i, i + 1));
        i += 1;
        break;
        
      case 0x11:
        commande[2] = strToHex(payload.substring(i, i + 2));
        i += 2;
        break;

      case 0x12:
        commande[3] = strToHex(payload.substring(i, i + 2));
        i += 2;
        break; 
    }
  }
}

int strToHex (String str) {
  int result = 0;
  int j = 0;
  
  for (int i = str.length() - 1; i >= 0; i--) {
    if (str.charAt(i) >= 65)
      result += (str.charAt(i) - 'A' + 10) * mathPow(16, j++);
    else {
      result += (str.charAt(i) - '0') * mathPow(16, j++);
    }
  } 
  return result;
}

int mathPow(int x, int y) {
  if (y == 0)
    return 1;

  int result = 1;

  for (int i = 0; i < y; i++) {
    result = result * x;
  }

  return result;
}
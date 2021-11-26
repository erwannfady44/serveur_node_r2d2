int commande[4];

const int leftforward = 9;
const int leftbackward = 10;
const int rightforward = 8;
const int rightbackward = 7;

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(leftforward, OUTPUT);
  pinMode(leftbackward, OUTPUT);
  pinMode(rightforward, OUTPUT);
  pinMode(rightbackward, OUTPUT);
}

void loop() {
  /*String msg = readData();
  if (msg != "") {
    decodePayload(msg, commande);
    if (commande[0] == 2)
      digitalWrite(LED_BUILTIN, HIGH);
    else
      digitalWrite(LED_BUILTIN, LOW);
  }
  delay(50);*/
  commande[0] = 1;
  commande[1] = 100;
  commande[2] = 1;
  commande[3] = 100;
  move(commande);

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

void move(int commande[]) {
   switch (commande[0]) {
      //Si on veut backwardr
      case 1 :
         analogWrite(leftbackward, commande[1]);
         break;

      case 2 :
         analogWrite(leftforward, commande[1]);
         break;

      default :
         analogWrite(leftforward, 0);
         analogWrite(leftbackward, 0);
         break;
   }

   switch (commande[2]) {
      //Si on veut backwardr
      case 1 :
         analogWrite(rightbackward, commande[3]);
         break;

      case 2 :
         analogWrite(rightforward, commande[3]);
         break;

      default :
         analogWrite(rightforward, 0);
         analogWrite(rightbackward, 0);
         break;
   }
}

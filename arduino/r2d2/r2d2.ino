#include <Wire.h>
#define I2C_SLAVE_ADDRESS 0x08

const int leftforward = 7;
const int leftbackward = 8;
const int rightforward = 10;
const int rightbackward = 9;
const int head1 = 11;
const int head2 = 12;

const int trig = 15;
const int echo = 16;

int data[5] = {};

int lastData = 100;
void setup()
{
  Wire.begin(I2C_SLAVE_ADDRESS);
  Wire.onReceive(receiveEvent);
  Serial.begin(9600);

  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(leftforward, OUTPUT);
  pinMode(leftbackward, OUTPUT);
  pinMode(rightforward, OUTPUT);
  pinMode(rightbackward, OUTPUT);
  pinMode(head1, OUTPUT);
  pinMode(head2, OUTPUT);

}
void loop() {
  if (lastData == 0) {
    for (int i = 0; i < 4; i++) {
      data[i] = 0;
    }
  } else {
    for (int i = 0; i < 4; i++) {
      Serial.print(data[i]);
      Serial.print(" ");
    }
    Serial.println();
  }
  lastData -= 1;
  delay(10);
  move(data);
}

void receiveEvent(int lenght) {
  int tab[lenght] = {0};

  for (int i = 0; i < lenght; i++) {
    tab[i] = Wire.read();
  }

  for (int i = 0; i < lenght; i++) {
    switch (tab[i]) {
      case 0x01:
        data[0] = tab[++i];
        break;

      case 0x02:
        data[2] = tab[++i];
        break;

      case 0x11:
        data[1] = tab[++i];
        break;

      case 0x12:
        data[3] = tab[++i];
        break;

      case 0x03:
        data[4] = tab[++i];
        break;
    }
  }
  lastData = 10;
}

void move(int commande[]) {
  if (getLength < 10 && commande[0] == 2 && commande[0] == 2) {
    commande[0] = 0;
    commande[2] = 0;
  }
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
  switch (commande[4]) {
    //Si on veut backwardr
    case 1 :
      analogWrite(head1, 150);
      break;

    case 2 :
      analogWrite(head2, 150);
      break;

    default :
      analogWrite(head1, 0);
      analogWrite(head2, 0);
      break;
  }

}

// fonction de mesure de la distance
long getLength()
{
  // 1. Lance une mesure de distance en envoyant une impulsion HIGH de 10µs sur la broche TRIGGER
  // On envoie le trigger
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  // 2. Mesure le temps entre l'envoi de l'impulsion ultrasonique et son écho (si il existe)
  long mesure = pulseIn(echo, HIGH, 25000);

  // 3. Calcul la distance à partir du temps mesuré
  long distance = mesure * 17 / 1000;
  delay(10);
  return distance;
}

#include <Wire.h>
# define I2C_SLAVE_ADDRESS 0x08 // 12 pour l'esclave 2 et ainsi de suite

const int leftforward = 9;
const int leftbackward = 10;
const int rightforward = 8;
const int rightbackward = 7;


int data[4] = {};

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
}
void loop(){  
  for (int i = 0; i < 4; i++) {
    Serial.print(data[i]);
  }Serial.print('\n');
  if (data[0] == 2)
      digitalWrite(LED_BUILTIN, HIGH);
  else
      digitalWrite(LED_BUILTIN, LOW);

  if (lastData == 0) {
    for (int i = 0; i < 4; i++) {
      data[i] = 0;
    }
  } 
  lastData -= 1;
  delay(10);
}

void receiveEvent(int lenght) {
  int tab[lenght] = {0};
  
  for (int i = 0; i < lenght; i++) {
    tab[i] = Wire.read();
  }

  for (int i = 0; i < lenght; i++) {
    switch(tab[i]) {
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
    }
  }
  lastData = 10;
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

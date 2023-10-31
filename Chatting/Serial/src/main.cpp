#include <Arduino.h>
#include <SoftwareSerial.h>
 
SoftwareSerial mySerial(13,12); //시리얼통신 핀 Rx : 13, Tx : 12
 
void setup()
{
    Serial.begin(115200);
    mySerial.begin(9600); //기존 9600이여서 다른 통신속도를 사용해야함
}
 
void loop()
{
  while(Serial.available()){
    
    char text;
    text =Serial.read();
    Serial.write(text);
    mySerial.write(text);
  }

  while(mySerial.available()){
    char text1;
    text1 = mySerial.read();
    Serial.write(text1);
  }
}

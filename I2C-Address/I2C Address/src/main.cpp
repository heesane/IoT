#include <Wire.h>
#include <Arduino.h>

void setup()
{
  Wire.begin();
  Serial.begin(115200);
}

void loop()
{
  byte address,flag=0;
  Serial.println("Scanning");
  for(address = 1; address < 127; address++ ) 
  {
    Wire.beginTransmission(address);

    if (Wire.endTransmission() == 0)
    {
      Serial.print("I2C device address : 0x");
      if (address<16) 
        Serial.print("0");
      Serial.print(address,HEX);
      Serial.println("\nAddress scan success\n");
      flag = 1;
      break;
    }
  }
  if(flag == 0)
    Serial.println("Address scan fail\n");
  delay(5000);
}
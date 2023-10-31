#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

#define ledPin 15
#define ledNum 4

int LEDarr[4][4] = {{1,0,0,0},{0,0,0,0},{2,0,0,0},{3,0,0,0}};

//shift할때 필요한 버퍼 생성
int temp0[4];
int temp1[4];
int temp2[4];

Adafruit_NeoPixel pixels(ledNum, ledPin, NEO_GRB + NEO_KHZ800);
void setup() {
    Serial.begin(115200);
    pixels.begin();
    delay(1000);
    Serial.println("starting");    
}

void loop() {
    
    //Random RGB값 생성
    int ranR = random(0,50);
    int ranG = random(0,50);
    int ranB = random(0,50);

    //새로운 랜덤RGB값
    LEDarr[0][1] = ranR;
    LEDarr[0][2] = ranG;
    LEDarr[0][3] = ranB;
    
    //네오픽셀
    for(int i =0;i<ledNum;i++){
        pixels.setPixelColor(LEDarr[i][0],LEDarr[i][1],LEDarr[i][2],LEDarr[i][3]);
    }
    pixels.show();
    delay(500); 

    //shift 준비
    for(int i=0;i<ledNum-1;i++){ 
        temp0[i] = LEDarr[0][i+1];
        temp1[i] = LEDarr[1][i+1];
        temp2[i] = LEDarr[2][i+1];
    }

    //shift
    for(int i=0;i<ledNum-1;i++){ 
        LEDarr[1][i+1] = temp0[i];
        LEDarr[2][i+1] = temp1[i];
        LEDarr[3][i+1] = temp2[i];
    }
    
       
}  
#include <Arduino.h>
#include <IO7F8266.h>
#include <Wire.h>

String user_html = "";

const int           pulseA = 12;
const int           pulseB = 13;
volatile int        lastEncoded = 0;
volatile int        encoderValue = 0;
int                 prev_value = 0;

char* ssid_pfix = (char*)"Switch";
unsigned long lastPublishMillis = -pubInterval;
unsigned long lastRotatePub = 0;
const int BUTTON = 2;
volatile bool pressed = false;
volatile bool rotate = false;


IRAM_ATTR void pushed() {
    pressed = true;
}

IRAM_ATTR void handleRotary() {
    rotate = true;

    // Never put any long instruction
    int MSB = digitalRead(pulseA); //MSB = most significant bit
    int LSB = digitalRead(pulseB); //LSB = least significant bit

    int encoded = (MSB << 1) |LSB; //converting the 2 pin value to single number
    int sum  = (lastEncoded << 2) | encoded; //adding it to the previous encoded value
    if(sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011) encoderValue ++;
    if(sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000) encoderValue --;
    if (encoderValue > 30) {
        encoderValue = 30;
    } else if (encoderValue < 0 ) {
        encoderValue = 0;
    }
    if (prev_value != encoderValue) {
        rotate = true;
    }
}

void publishData() {
    StaticJsonDocument<512> root;
    JsonObject data = root.createNestedObject("d");
    
    if(rotate){
        if(prev_value<encoderValue){
            data["switch"] = "on";
            
        }else{
            data["switch"] = "off";
        }
        prev_value = encoderValue;
        lastRotatePub = millis();
        rotate= false;
    }   

    
    if (pressed) {
        data["pressed"] = "true";
        Serial.printf("켜졌습니다.\n");
        delay(200);
        pressed = false;
    } else {
        data["pressed"] = "false";
        Serial.printf("꺼졌습니다.\n");

    }

    serializeJson(root, msgBuffer);
    client.publish(evtTopic, msgBuffer);
}

void setup() {
    Serial.begin(115200);

    pinMode(BUTTON, INPUT_PULLUP);
    pinMode(pulseA, INPUT_PULLUP);
    pinMode(pulseB, INPUT_PULLUP);

    attachInterrupt(BUTTON, pushed, FALLING);
    attachInterrupt(pulseA, handleRotary, CHANGE);
    attachInterrupt(pulseB, handleRotary, CHANGE);  

    initDevice();
    JsonObject meta = cfg["meta"];
    pubInterval = meta.containsKey("pubInterval") ? meta["pubInterval"] : 0;
    lastPublishMillis = -pubInterval;

    WiFi.mode(WIFI_STA);
    WiFi.begin((const char*)cfg["ssid"], (const char*)cfg["w_pw"]);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    // main setup
    Serial.printf("\nIP address : ");
    Serial.println(WiFi.localIP());

    set_iot_server();
    iot_connect();
}

void loop() {
    if (!client.connected()) {
        iot_connect();
    }
    client.loop();
    if(abs(prev_value-encoderValue) <8 || rotate && (millis()-lastRotatePub < 500)){
        rotate = false;
    }
    if (pressed || rotate || ((pubInterval != 0) && (millis() - lastPublishMillis > pubInterval))) {
        publishData();
        lastPublishMillis = millis();
    }
}
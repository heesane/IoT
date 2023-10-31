#include <ESP8266WiFi.h>
#include <PubSubClient.h>
 
#define             RELAY 15
const char*         ssid ="heesang";
const char*         password = "12345678";
const char*         mqttServer = "44.213.164.206";
const int           mqttPort = 1883;

unsigned long       interval = 10000;
unsigned long       lastPublished = - interval;
 
WiFiClient espClient;
PubSubClient client(espClient);
void callback(char* topic, byte* payload, unsigned int length);
void pubStatus();
// setup
void setup() {
    Serial.begin(115200);
    pinMode(RELAY, OUTPUT);
    // STA mode
    WiFi.mode(WIFI_STA); 
    // 지정된 wifi와 password로 wifi에 붙이기
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    // connect success
    Serial.println("Connected to the WiFi network");
    
    // *** mqtt서버에 붙이기 + callback 함수 정의
    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback);
    // mqtt 접속 대기중
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        if (client.connect("ESP8266Relay")) {
            Serial.println("connected");  
        } else {
            Serial.print("failed with state "); Serial.println(client.state());
            delay(2000);
        }
    }

    //setup함수에서 해당 토픽으로 subscribe + 초기 relay를 low로 설정
    client.subscribe("id/heesang/relay/cmd");
    digitalWrite(RELAY, LOW);
}

// loop문
void loop() {
    client.loop();

    // interval = 1000 -> 1초마다 publish
    // 현재 interval = 10000
    unsigned long currentMillis = millis();
    if(currentMillis - lastPublished >= interval) {
        lastPublished = currentMillis;
        pubStatus();
    }
}
// 메세지 보내기
void pubStatus() {
    char buf[10];
    if (digitalRead(RELAY) == HIGH) {
        sprintf(buf, "on");
    } else {
        sprintf(buf, "off");
    }
    client.publish("id/heesang/relay/evt", buf);
}

// 메세지가 올때,
void callback(char* topic, byte* payload, unsigned int length) {
 
    char msgBuffer[20];
    if(!strcmp(topic, "id/heesang/relay/cmd")) {
        int i;
        for(i = 0; i < (int)length; i++) {
            msgBuffer[i] = payload[i];
        } 
        msgBuffer[i] = '\0';
        Serial.printf("\n%s -> %s", topic, msgBuffer);
        if(!strcmp(msgBuffer, "on")) {
            digitalWrite(RELAY, HIGH);
        } else if(!strcmp(msgBuffer, "off")) {
            digitalWrite(RELAY, LOW);
        }
    }
    pubStatus();
}
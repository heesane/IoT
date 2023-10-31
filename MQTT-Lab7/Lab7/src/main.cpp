#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ConfigPortal8266.h> 

#define             RELAY 15
char*               ssid_pfix = (char*)"2018146037";
String              user_config_html =""
  "<p><input type='text' name='mqttServer' placeholder='mqtt_Broker'>";

const char*         mqttServer;
const int           mqttPort = 1883;

unsigned long       interval = 10000;
unsigned long       lastPublished = - interval;
 
WiFiClient espClient;
PubSubClient client(espClient);
void callback(char* topic, byte* payload, unsigned int length);
void pubStatus();

void setup() {
    Serial.begin(115200);
    pinMode(RELAY, OUTPUT);
     
    loadConfig();
    if(!cfg.containsKey("config")||strcmp((const char*)cfg["config"],"done")){
      configDevice();
    }

    WiFi.mode(WIFI_STA);
    WiFi.begin((const char*)cfg["ssid"],(const char*)cfg["w_pw"]);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    mqttServer = cfg["mqttServer"];

    Serial.println("Connected to the WiFi network");
    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback);
 
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");
 
        if (client.connect("ESP8266Relay")) {
            Serial.println("connected");  
        } else {
            Serial.print("failed with state "); Serial.println(client.state());
            delay(2000);
        }
    }
    client.subscribe("id/heesang/relay/evt");
    digitalWrite(RELAY, LOW);
}

void loop() {
    client.loop();

    unsigned long currentMillis = millis();
    if(currentMillis - lastPublished >= interval) {
        lastPublished = currentMillis;
        pubStatus();
    }
}

void pubStatus() {
    char buf[10];
    if (digitalRead(RELAY) == HIGH) {
        sprintf(buf, "on");
    } else {
        sprintf(buf, "off");
    }
    client.publish("id/heesang/relay/cmd", buf);
    Serial.printf("\n[PUBLISH] %s <- %s","id/heesang/relay/cmd",buf);
}

void callback(char* topic, byte* payload, unsigned int length) {
 
    char msgBuffer[20];
    if(!strcmp(topic, "id/heesang/relay/evt")) {
        int i;
        for(i = 0; i < (int)length; i++) {
            msgBuffer[i] = payload[i];
        } 
        msgBuffer[i] = '\0';
        Serial.printf("\n[SUBSCRIBE]%s -> %s", topic, msgBuffer);
        if(!strcmp(msgBuffer,"on")) {
            digitalWrite(RELAY, HIGH);
        } else if(!strcmp(msgBuffer,"off")) {
            digitalWrite(RELAY, LOW);
        }
    }
}
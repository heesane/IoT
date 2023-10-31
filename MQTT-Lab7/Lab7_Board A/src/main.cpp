#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ConfigPortal8266.h>
#include <DHTesp.h>

#define             RELAY 15
char*               ssid_pfix = (char*)"heesang";
String              user_config_html =""
    "<p><input type='text' name='mqttServer' placeholders='mqtt_Broker'>";

const char*         mqttServer;
const int           mqttPort = 1883;
double              hum_buf[10];
unsigned long       interval = 10000;
unsigned long       lastPublished = - interval;

DHTesp              dht;
WiFiClient espClient;
PubSubClient client(espClient);
void callback(char* topic, byte* payload, unsigned int length);
void pubStatus();

void setup() {
    Serial.begin(115200);
    dht.setup(14, DHTesp::DHT22); // Connect DHT sensor to GPIO 14    
    loadConfig();
    
    if(!cfg.containsKey("config") || strcmp((const char*)cfg["config"],"done")){
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
 
        if (client.connect("Humidity")) {
            Serial.println("connected");  
        } else {
            Serial.print("failed with state "); Serial.println(client.state());
            delay(2000);
        }
    }
    client.subscribe("id/heesang/relay/cmd");
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
    char hum_buf[10];
    sprintf(hum_buf,"%lf",dht.getHumidity());
    client.publish("id/heesang/sensor/evt/humidity", hum_buf);
    Serial.printf("[PUBLISH] %s -> %s","id/heesang/sensor/evt/humidity",hum_buf);
}

void callback(char* topic, byte* payload, unsigned int length) {
 
    char msgBuffer[20];
    if(!strcmp(topic, "id/heesang/relay/cmd")) {
        int i;
        for(i = 0; i < (int)length; i++) {
            msgBuffer[i] = payload[i];
        } 
        msgBuffer[i] = '\0';
        if(!strcmp(msgBuffer, "on")) {
            Serial.printf("\n[SUBSCRIBE] %s -> %s","id/heesang/relay/cmd","on");
        } else if(!strcmp(msgBuffer, "off")) {
            Serial.printf("\n[SUBSCRIBE] %s -> %s","id/heesang/relay/cmd","off");
        }
    }
    pubStatus();
}
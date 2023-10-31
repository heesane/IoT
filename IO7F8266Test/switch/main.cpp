#include <Arduino.h>
#include <IO7F8266.h>

String user_html = "";

char* ssid_pfix = (char*)"IO7Button";
unsigned long lastPublishMillis = -pubInterval;
const int BUTTON = 2;
volatile bool pressed = false;

IRAM_ATTR void  pushed() {
    pressed = true;
}

void publishData() {
    StaticJsonDocument<512> root;
    JsonObject data = root.createNestedObject("d");

    if (pressed) {
        data["pressed"] = "true";
        delay(200);
        pressed = false;
    } else {
        data["pressed"] = "false";
    }

    serializeJson(root, msgBuffer);
    client.publish(evtTopic, msgBuffer);
}

void setup() {
    Serial.begin(115200);
    pinMode(BUTTON, INPUT_PULLUP);
    attachInterrupt(BUTTON, pushed, FALLING);

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
    if (pressed || ((pubInterval != 0) && (millis() - lastPublishMillis > pubInterval))) {
        publishData();
        lastPublishMillis = millis();
    }
}
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>

const byte          DNS_PORT = 53;
IPAddress           apIP(192, 168, 1, 1);
DNSServer           dnsServer;
ESP8266WebServer    webServer(80);
const int           RELAY = 15;

String responseHTML = ""
    "<!DOCTYPE html><html><head><title>CaptivePortal</title></head><body><center>"
    "<p>Captive Sample Server App</p>"
    "<button id='onbutton' style='width:160px;height:60px'><font size='20'>ON</font></button>"
    "<button id='offbutton' style='width:160px;height:60px'><font size='20'>OFF</font></button>"
    "<script>var xhttp=new XMLHttpRequest();"
    "  onbutton.onclick=function(e) {"
    "    xhttp.open('GET', 'http://192.168.1.1/turnOn', false);"
    "    xhttp.send(''); }"
    "</script><script>var xhttp=new XMLHttpRequest();"
    "  offbutton.onclick=function(e) {"
    "    xhttp.open('GET', 'http://192.168.1.1/turnOff', false);"
    "    xhttp.send(''); }"
    "</script><p>This is a captive portal example</p></center></body></html>";

void turnOn(){
    Serial.println("Turn On");
    digitalWrite(RELAY,HIGH);
    webServer.send(200, "text/plain", "OK");
}

void turnOff(){
    Serial.println("Turn Off");
    digitalWrite(RELAY,LOW);
    webServer.send(200, "text/plain", "OK");
}

void setup() {
    Serial.begin(115200);
    pinMode(RELAY, OUTPUT);
    delay(2000);
    Serial.println();
    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
    WiFi.softAP("Test");

    // if started with "*" for domain name, it will reply with provided IP to all DNS request
    dnsServer.start(DNS_PORT, "*", apIP);

    webServer.on("/turnOn", turnOn);
    webServer.on("/turnOff", turnOff);

    // replay to all requests with same HTML
    webServer.onNotFound([]() {
        webServer.send(200, "text/html", responseHTML);
    });
    webServer.begin();
    Serial.println("Captive Portal Started");
}

void loop() {
    dnsServer.processNextRequest();
    webServer.handleClient();
}
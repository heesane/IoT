import sys
import paho.mqtt.client as mqtt
server = "44.213.164.206" 

client = mqtt.Client()
client.connect(server, 1883, 60)

while(1):
    print("Input ON/OFF : ",end="")
    on_off = input()
    client.publish("id/heesang/switch/evt",on_off)
import sys
import paho.mqtt.client as mqtt
import requests

topic = "id/yourname/switch/evt"
server = "iotlab101.io7lab.com"
relay = '192.168.72.177'
#relay = 'webrelay.local'
#server = "52.78.220.207"

def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    cmd = msg.payload.decode('utf-8')
    if cmd == 'on':
        r = requests.get(url = 'http://' + relay + '/turnOn')
    elif cmd == 'off':
        r = requests.get(url = 'http://' + relay + '/turnOff')
    else:
        return
    print(r)

client = mqtt.Client()
client.connect(server, 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()

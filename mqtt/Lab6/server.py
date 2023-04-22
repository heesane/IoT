import sys
import paho.mqtt.client as mqtt

topic = "id/yourname/sensor/evt/#"
server = "iotlab101.io7lab.com"

def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    measurement = float(msg.payload.decode('utf-8'))
    print(f'{msg.topic:38} {measurement: >5.1f}')

client = mqtt.Client()
client.connect(server, 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()

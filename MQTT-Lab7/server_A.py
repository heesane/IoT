import sys
import paho.mqtt.client as mqtt

topic = "id/heesang/relay/cmd"
server = "iotlab101.tosshub.co"

def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    cmd = msg.payload.decode('utf-8')
    if cmd == 'on':
        r = "turn ON"
        print(r)
    elif cmd == 'off':
        r = "turn Off"
        print(r)
    else:
        return
    print(r)

client = mqtt.Client()
client.connect(server, 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()

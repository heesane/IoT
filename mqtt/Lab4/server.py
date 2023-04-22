import sys
import paho.mqtt.client as mqtt

topic = "id/heesang/switch/evt"
server = "44.213.164.206"

def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    cmd = msg.payload.decode('utf-8')
    if cmd == 'on':
        client.publish("id/heesang/relay/cmd", 'on')
        print(topic+" : ON")
    elif cmd == 'off':
        client.publish("id/heesang/relay/cmd", 'off')
        print(topic + " : OFF")
    else:
        return

client = mqtt.Client()
client.connect(server, 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()

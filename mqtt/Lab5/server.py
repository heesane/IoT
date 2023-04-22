import sys
import paho.mqtt.client as mqtt

topic = "id/yourname/switch/evt"
server = "iotlab101.io7lab.com"

def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    cmd = msg.payload.decode('utf-8')
    if cmd == 'on':
        client.publish("id/yourname/relay/cmd", 'on')
    elif cmd == 'off':
        client.publish("id/yourname/relay/cmd", 'off')
    else:
        return

client = mqtt.Client()
client.connect(server, 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()

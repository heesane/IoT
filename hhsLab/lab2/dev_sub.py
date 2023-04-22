import ssl
import paho.mqtt.client as mqtt
server = "44.213.164.206"
def on_connect(client, userdata, flags, rc):
 print("Connected with RC : " + str(rc))
 client.subscribe("iot3/hhsdev/cmd/power/fmt/json")
def on_message(client, userdata, msg):
 print(msg.topic+" "+msg.payload.decode('utf-8'))
client = mqtt.Client()
client.username_pw_set('hhsdev', 'dev1234')
client.on_connect = on_connect
client.on_message = on_message
client.connect(server, 1883, 60)
client.loop_forever()

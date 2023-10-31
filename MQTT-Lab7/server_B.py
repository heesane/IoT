import sys
import paho.mqtt.client as mqtt

topic = "id/heesang/sensor/evt/humidity"
server = "iotlab101.tosshub.co"
relay = '192.168.188.244'
def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    humidity = float(msg.payload.decode('utf-8'))
    if humidity > 50:
        client.publish("id/heesang/relay/evt","on")
        print("id/heesang/relay/evt -> on")
    else:
        client.publish("id/heesang/relay/evt","off")
        print("id/heesang/relay/evt -> off")    
client = mqtt.Client()
client.connect(server, 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()

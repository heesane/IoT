import paho.mqtt.client as mqtt
import threading
import os

server = "iotlab101.io7lab.com"
state = {}
def on_connect(client, userdata, flags, rc):
    print("Connected with RC : " + str(rc))
    client.subscribe("$SYS/#")

def on_message(client, userdata, msg):
    state[msg.topic] = msg.payload.decode('utf-8')
    #print(msg.topic+" "+msg.payload.decode('utf-8'))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(server, 1883, 60)
def printStatus():
    os.system('clear')
    threading.Timer(2.0, printStatus).start()
    for s in state:
        print(s, ' -> ', state[s])

printStatus()

client.loop_forever()

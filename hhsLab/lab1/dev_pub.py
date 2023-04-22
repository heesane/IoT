import sys
import sys
import paho.mqtt.client as mqtt
server = "iotlab101.io7lab.com"
client = mqtt.Client()
client.connect(server,1883,60)

if len(sys.argv)<=1:
    print("Usage : on/off")
    exit()
else:
    client.publish("iot3/heesang/evt/status/fmt/json",str(sys.argv[1]))

import sys
import ssl
import paho.mqtt.client as mqtt
server = "iotlab101.io7lab.com"

client = mqtt.Client()
client.connect(server,1883,60)

client.publish("iot3/heesang/cmd/power/fmt/json",str(sys.argv[1]))
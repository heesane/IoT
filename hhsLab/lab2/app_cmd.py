import sys
import ssl
import paho.mqtt.client as mqtt
server = "44.213.164.206"
client = mqtt.Client()
client.username_pw_set('hhsapp', 'app1234')
client.connect(server, 1883, 60)
if len(sys.argv) <= 1:
 print("Usage : "+sys.argv[0]+" message")
 exit()
else:
 client.publish("iot3/hhsdev/cmd/power/fmt/json", str(sys.argv[1]))
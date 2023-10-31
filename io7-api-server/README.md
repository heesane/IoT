# iot7 Device Cloud API Server

This repo is for the iot7 Device Cloud API Server.

### Configuration Environment Variables and default values
* ADMIN_ID || admin
* ADMIN_PASSWORD || passw0rd
* MQTT_CONN || 'mqtts://127.0.0.1'
* DYNSEC_FILE  || './mqtt/dynamic-security.json'

## Change History

--- 2023/01/08
This is the initial version of the API Server for the iot7 device cloud.

To use it,
generate the server certificate and key by

```
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout iothub.key -out iothub.crt

```

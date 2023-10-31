# OTA_Upgraing
## Description
### OTA Upgrading &amp; Lamp_Switch


---
## 동작 

https://user-images.githubusercontent.com/93089183/235606480-43e47540-c752-4364-a27e-e2447e6ca90a.mp4

----

## OTA Firmware Upgrading




https://user-images.githubusercontent.com/93089183/235607054-12b26513-f43d-4b4a-9328-096c265cd485.mp4

---

## 설명

우선 초기에 FirmWare를 업데이트 하지 않았을 경우, Switch를 누를 때 아무것도 출력되지 않지만, 누를 때 "on", "off"를 출력하도록 
Build하여 firmware.bin파일을 만들어서 data/nodered/firmware 폴더 안에 넣어 OTA 업그레이드를 진행 했습니다.

이후, IO7Management 페이지로 가서 Switch1 디바이스의 Firmware URL에 http://3.226.142.20:1880/ota 를 넣어 Nodered에서 get방식으로 넘겨주어 Firmware 업데이트를 마무리 했습니다.


----
# Node Red

![OTA_Upgrading](https://user-images.githubusercontent.com/93089183/235609703-f47451a3-ca74-40b2-952c-32781b811c06.png)

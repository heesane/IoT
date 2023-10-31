# AWS-MQTT

한 영상에 모든것을 담기에는 용량이 너무 커져서 부분부분으로 나누어서 업로드하였습니다.

# <구동영상>

https://user-images.githubusercontent.com/93089183/203316313-ba6cafc8-21e2-4cca-9ca1-a365a95ca6f3.mp4

AWS에서 구축한 MQTT Broket를 통하여 아두이노 Publish, Subscribe로 DHT22로 습도가 50이상인 경우 Relay on, 미만인 경우 Relay off를 규칙으로 구동하는 영상이다.




# <Python 코드 변경된 부분>


https://user-images.githubusercontent.com/93089183/203316547-c9eb1b1d-4a34-4e54-84bf-ac6e3174aec2.mp4

이전 주착에서 진행했던 Lab7과 똑같은 코드에 server 부분만 iotlab101.tosshub.co에서 AWS의 IP Address로 변경하여 실행시켰다.
정상적으로 MQTT에 접속하는 것을 구동영상을 통해 확인할 수 있다.


# Configuration Part


https://user-images.githubusercontent.com/93089183/203316634-58b46cee-14bb-42c1-a47d-0a5f5a6ac86a.mp4

아두이노 ESP8266 Board A,B를 config portal를 통해 자동적으로 기존에 존재하던 WiFi에 접속하여 MQTT접속을 시도하는 것을 확인할 수 있다. 위 영상에서 Captive Portal에 WiFi 이름, 비밀번호, 접속하려는 AWS의 IP Address를 확인할 수 있다.



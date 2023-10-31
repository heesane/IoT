# MQTT-Relay
3주차 IoT 과제 구동 영상 및 설명


https://user-images.githubusercontent.com/93089183/228229183-19226d88-00e2-4bdf-a3bb-19f661317c7d.mp4



1.  MQTT Lab의 Lab1에서 pub.py를 실행 할 때, "python pub.py on"로 sys.agrv를 통해 on과 off를 subscribe하고 있는 topic으로 publish를 진행하였는데, argument로 넘겨주는 것이 아닌 while문을 통해 on과 off를 편하게 넘겨 줄 수 있게 변경하였다. 이 부분이 
python switch에 해당한다.

2. Arduino ESP 8266이 subscribe하고 있는 topic과 ESP 8266이 heesang이라는 Wi-Fi에 ssid를 통해 연결되고, 이를 통해 AWS EC2 instance에서 실행되고 있는 1883포트로 접근하게 된다. 1883포트는 docker-compose를 통해 Eclipse-mqtt를 daemon으로 실행중이고 
id/heesang/relay/cmd를 subscribe한다.

3. 해당 토픽으로 on이 들어오면 RELAY를 HIGH로, off가 들어오면 RELAY를 LOW로 설정한다. 또한, 이때 id/heesang/relay/evt로 on 또는 off를 전송한다. 이 부분이 ESP8266 MQTT Relay component이다.

4. id/heesang/relay/evt를 subscribe하고 있는 python file로 현재 ESP8266의 Relay의 상태가 on인지, off인지 나타낸다. 이 부분이 control program python에 해당한다.

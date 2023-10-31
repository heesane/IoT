# MQTT-Lab7

## 구동 영상
https://user-images.githubusercontent.com/93089183/201945805-44dedb78-c446-4d92-9502-c4d1b68c0943.mp4

용량 문제로 영상의 화질이 떨어지는점 죄송합니다.

ESP8266 Board A에 올라가는 파일은 Lab7_Board A폴더에,

ESP8266 Board B에 올라가는 파일은 Lab7 폴더에,

Python을 사용한 파일은 server_A.py, server_B.py로 업로드 하였습니다.


화질이 좋지 않아, Humidity가 정확하게 영상으로 보여지지않는데,
초기에는 쓰레기 값으로 인한 server_A.py에서 turn on으로 출력이 나오지만 각 ESP8266에 PlatformIO가 업로드 된 이후에는 정상적으로 동작하는 것을 관찰할 수 있습니다.
습도의 상승을 유발하기 위하여 DHT22 모듈에 입김을 불어 습도를 올리자 Humidity가 상승하는 것을 확인할 수 있고, 이로 인하여 Subscribe하고 있는 Topic으로 Data가 이동하고,
Board B까지 이동하여 Board B의 Relay가 정상적으로 켜지고 꺼지는 것을 확인 할 수 있었습니다.

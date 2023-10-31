# Docker-Excercise
1주차 IoT 실습 과제 영상 및 설명


https://user-images.githubusercontent.com/93089183/226158526-95daf343-b8f5-4df4-b226-9fb12526b41f.mp4



./sys.monitor를 통해서 influxdb 안의 mydb라는 데이터 베이스 안의 measurment에 5초 단위로 데이터를 전송하고,
docker-compose -f influxdb up을 통해 influxdb에 들어오는 데이터들을 log로 확인하는 영상입니다.

해당 과정을 통해 최종적으로 입력된 데이터들의 흐름을 Grafana를 통해 시각적으로 Gauge, Graph 등을 통해 대쉬보드에 표현할 수 있습니다.

![image](https://user-images.githubusercontent.com/93089183/226158622-591c8e3a-72fe-44c1-9a69-17f0fbe8410e.png)

# ESP8266-WebServer
2주차 IoT 실습 과제


https://user-images.githubusercontent.com/93089183/226160637-7a7cf503-b7f9-4269-9c23-ac53a1dee436.mp4

ESP8266WebServer 라이브러리를 통해 80번 포트로 server 객체를 생성하고 
라이브러리에 있는 내장 기능을 통해 "/" 루트로 접속을 하면 뒤에 붙는 쿼리문(?aa=bb&cc=dd)을 통해 정보를 표현한다.
/inline으로 접속하게되면 Hello from the inline fuction을 화면에 출력한다.
src파일을 컴파일 했을때 serial monitor에 출력되는 ip의 80번 포트로 접근해도 접속이 가능하지만,
mdns의 이름으로 heesang이라는 도메인으로도 열려있기때문에 http://heesang.local/inline 이런식의 접근도 허용된다.

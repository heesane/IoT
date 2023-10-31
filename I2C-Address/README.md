# I2C Address



https://user-images.githubusercontent.com/93089183/193551418-9227cbc0-62e8-4246-94c8-cc399c630bf9.mp4

# 아이디어

> 임의의 주소 Address를 선언하고 Wire.endTransmission()이 0이 아닌 값을 갖는다면 Address 값을 1 더해주고 같은 동작을 반복하여
Wire.endTransmission()이 0으로 통신이 정상적으로 작동한다면 I2C 통신을 갖는 장비의 주소를 찾았다는 뜻이므로,
그떄의 주소를 16비트 형식으로 출력하게 설계하였다.

# 궁금한점

> 교수님이 PPT에서 알려주신 Hint부분을 활용했으나, error = Wire.endTransmission()을 활용할때, 오류가 지속적으로 발생하였는데
error의 자료형을 어떤 형식으로 지정해야하는지 궁금합니다. 과제를 진행할 때는 error를 쓰지않고, 직접 Wire.endTransmission()을 활용하여 진행하였습니다.

# 결과

> 코드를 Upload하여 Serial Monitor로 확인해본 결과, 영상에서는 I2C 장치의 주소값이 0x39로 나오는 것을 확인하였습니다.

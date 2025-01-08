# bible-reading-calculator

$ pip install -r requirements.txt
$ streamlit run bible_app.py


---
# Android App

$ npx @react-native-community/cli init BibleReadingApp
$ cd BibleReadingApp
$ npm install @react-native-community/datetimepicker react-native-progress
$ npm install --save-dev @types/react @types/react-native

- App.tsx
- metro.config.js
- package.json

#### Java 17 설치
$ arch -arm64 brew install openjdk@17
$ sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

#### 개발 서버 시작
$ npx react-native start
$ export JAVA_HOME=$(/usr/libexec/java_home -v 17)
$ export PATH=$JAVA_HOME/bin:$PATH
$ cd android
$ echo "sdk.dir=/Users/$USER/Library/Android/sdk" > local.properties
```
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools/bin' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
```
$ ./gradlew clean


#### 안드로이드 앱 실행
- Android Studio에서 Android Virtual Device (AVD) 생성
- 또는, 안드로이드 기기를 USB 디버깅 모드로 연결 
$ npx react-native run-android


---
#### APK 만들기
- 1) 릴리즈 서명키 생성 (solafide)
$ cd android
$ keytool -genkey -v -keystore bible-reading-key.keystore -alias bible-reading-alias -keyalg RSA -keysize 2048 -validity 10000

- 2) 빌드
$ cd android
$ ./gradlew clean
$ ./gradlew assembleRelease


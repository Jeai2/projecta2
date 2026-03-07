# 묵설이 메신저봇R 스크립트

메신저봇R 앱에서 묵설이(mook-a) API를 연동하고, **선녀 모드(오늘운세)** 응답 시 강신 이미지를 전송하는 스크립트입니다.

## 설정

### 1. 이미지 경로

`mookseol.js` 상단에서 선녀 모드 강신 이미지 경로를 설정합니다.

```javascript
const FAIRY_IMAGE = "/sdcard/DCIM/MookA/mode_fairy.png";
```

- `mode_fairy.png` 파일을 위 경로에 저장해 두세요.
- 폴더가 없으면 `/sdcard/DCIM/MookA/` 디렉터리를 먼저 만들어 주세요.

### 2. API URL

서버 주소를 실제 환경에 맞게 변경합니다.

```javascript
const MOOK_A_API_URL = "https://your-server.com";  // 예: "http://192.168.0.10:3001"
```

### 3. 대기 시간

선녀 모드일 때 텍스트 응답 후 이미지 전송까지의 대기 시간(기본 1.5초)입니다.

```javascript
const FAIRY_IMAGE_DELAY_MS = 1500;
```

## 동작 방식

1. 사용자 메시지 → mook-a API 호출
2. 텍스트 응답을 먼저 전송
3. `sendFairyImage: true`인 경우(오늘운세 응답) 1.5초 대기 후 강신 이미지 전송
4. `java.io.File`로 파일 존재 여부 확인 후 `Utils.sendImage` 또는 `file://` URI로 전송

## 사용 방법

1. 메신저봇R 앱에서 `mookseol.js` 스크립트를 추가합니다.
2. 위 설정(이미지 경로, API URL)을 수정합니다.
3. 스크립트를 컴파일 후 실행합니다.

## API 응답 형식

- 일반 응답: `{ error: false, reply: "..." }`
- 선녀 모드(오늘운세): `{ error: false, reply: "...", sendFairyImage: true }`

`sendFairyImage`가 `true`일 때만 강신 이미지가 전송됩니다.

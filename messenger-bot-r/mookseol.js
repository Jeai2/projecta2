/**
 * 묵설이 메신저봇R 스크립트
 * - mook-a API 호출 후 응답 전송
 * - 선녀 모드(오늘운세) 시 1.5초 대기 후 강신 이미지 전송
 *
 * [설정] 스크립트 상단 변수를 사용 환경에 맞게 수정하세요.
 */

// ========== [이미지 절대 경로 설정] ==========
const FAIRY_IMAGE = "/sdcard/DCIM/MookA/mode_fairy.png";

// ========== [API URL 설정] ==========
// 실제 서버 주소로 변경 (예: "https://your-server.com" 또는 "http://192.168.0.10:3001")
const MOOK_A_API_URL = "https://your-server.com";

// ========== [선녀 모드 이미지 전송 대기 시간 (ms)] ==========
const FAIRY_IMAGE_DELAY_MS = 1500;

/**
 * java.io.File로 파일 존재 여부 확인 후 이미지 전송
 * - Utils.sendImage (메신저봇R 네이티브) 우선 시도
 * - 실패 시 file:// URI로 replier.reply 시도
 */
function sendFairyImageSafely(room, replier) {
  try {
    var File = java.io.File;
    var f = new File(FAIRY_IMAGE);

    if (!f.exists()) {
      Api.makeNoti("묵설이 강신 이미지 없음", "경로 확인: " + FAIRY_IMAGE);
      return;
    }

    // 1) Utils.sendImage (메신저봇R 네이티브 API - 가장 안정적)
    if (typeof Utils !== "undefined" && Utils.sendImage) {
      Utils.sendImage(room, FAIRY_IMAGE);
      return;
    }

    // 2) replier.reply에 file:// URI 전달 (일부 버전 지원)
    var uri = "file://" + FAIRY_IMAGE;
    replier.reply(room, uri);
  } catch (e) {
    Api.makeNoti("묵설이 강신 이미지 전송 실패", String(e));
  }
}

/**
 * mook-a API 호출
 */
function callMookAApi(userId, birthDate, birthTime, gender, message, targetPerson, calendarType) {
  var url = MOOK_A_API_URL + "/api/fortune/mook-a";
  var bodyObj = { message: message };
  if (userId) bodyObj.userId = userId;
  if (birthDate) bodyObj.birthDate = birthDate;
  if (birthTime) bodyObj.birthTime = birthTime;
  if (gender) bodyObj.gender = gender;
  if (targetPerson) bodyObj.targetPerson = targetPerson;
  if (calendarType) bodyObj.calendarType = calendarType;
  var body = JSON.stringify(bodyObj);

  var conn = org.jsoup.Jsoup.connect(url)
    .ignoreContentType(true)
    .requestBody(body)
    .header("Content-Type", "application/json")
    .post();

  return JSON.parse(conn.body().text());
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId) {
  try {
    // API 호출 (userId 등은 봇 설정에서 가져오거나 빈 값)
    var res = callMookAApi(null, null, null, null, msg, null, null);

    if (res.error) {
      replier.reply(room, res.message || "묵설이가 잠들었나봐요!");
      return;
    }

    // 1) 텍스트 응답 먼저 전송
    replier.reply(room, res.reply);

    // 2) 선녀 모드일 때: 1.5초 대기 후 강신 이미지 전송 (극적인 타이밍)
    if (res.sendFairyImage === true) {
      if (typeof setTimeout === "function") {
        setTimeout(function () {
          sendFairyImageSafely(room, replier);
        }, FAIRY_IMAGE_DELAY_MS);
      } else {
        java.lang.Thread.sleep(FAIRY_IMAGE_DELAY_MS);
        sendFairyImageSafely(room, replier);
      }
    }
  } catch (e) {
    replier.reply(room, "묵설이가 잠들었나봐요! (오류: " + String(e) + ")");
    Api.makeNoti("묵설이 스크립트 오류", String(e));
  }
}

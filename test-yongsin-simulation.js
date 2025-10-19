// 용신 시스템 시뮬레이션 테스트
const { analyzeYongsin } = require("./server/src/services/yongsin.service.ts");

// 테스트 사주 데이터 1: 목이 강한 사주 (전왕용신 테스트)
const testSaju1 = {
  pillars: {
    year: { gan: "甲", ji: "寅" }, // 甲寅 - 목목
    month: { gan: "乙", ji: "卯" }, // 乙卯 - 목목
    day: { gan: "甲", ji: "辰" }, // 甲辰 - 목토
    hour: { gan: "乙", ji: "巳" }, // 乙巳 - 목화
  },
  wangseStrength: {
    finalScore: 8.5, // 매우 강함
  },
};

// 테스트 사주 데이터 2: 화가 많은 여름 사주 (조후용신 테스트)
const testSaju2 = {
  pillars: {
    year: { gan: "丙", ji: "午" }, // 丙午 - 화화
    month: { gan: "丁", ji: "未" }, // 丁未 - 화토
    day: { gan: "丙", ji: "午" }, // 丙午 - 화화
    hour: { gan: "丁", ji: "巳" }, // 丁巳 - 화화
  },
  wangseStrength: {
    finalScore: 5.0, // 보통
  },
};

// 테스트 사주 데이터 3: 수가 없는 사주 (병약용신 테스트)
const testSaju3 = {
  pillars: {
    year: { gan: "甲", ji: "寅" }, // 甲寅 - 목목
    month: { gan: "丙", ji: "午" }, // 丙午 - 화화
    day: { gan: "戊", ji: "辰" }, // 戊辰 - 토토
    hour: { gan: "庚", ji: "申" }, // 庚申 - 금금
  },
  wangseStrength: {
    finalScore: 5.0, // 보통
  },
};

console.log("=".repeat(60));
console.log("🔥 용신 시스템 시뮬레이션 테스트");
console.log("=".repeat(60));

console.log("\n📋 테스트 1: 목이 강한 사주 (전왕용신 예상)");
console.log("사주: 甲寅 乙卯 甲辰 乙巳");
console.log("오행분포: 木6개, 火1개, 土1개 (목 과다)");
try {
  const result1 = analyzeYongsin(testSaju1);
  console.log(`✅ 결과: ${result1.summary}`);
  console.log(`   용신: ${result1.primaryYongsin}`);
  console.log(`   확신도: ${result1.confidence}%`);
  if (result1.selectedTier) {
    console.log(`   적용된 렌즈: ${result1.selectedTier.name}`);
    console.log(`   이유: ${result1.selectedTier.reason}`);
  }
} catch (error) {
  console.log(`❌ 에러: ${error.message}`);
}

console.log("\n📋 테스트 2: 화가 많은 여름 사주 (조후용신 예상)");
console.log("사주: 丙午 丁未 丙午 丁巳");
console.log("기후분포: 燥 과다 (여름 + 화 많음)");
try {
  const result2 = analyzeYongsin(testSaju2);
  console.log(`✅ 결과: ${result2.summary}`);
  console.log(`   용신: ${result2.primaryYongsin}`);
  console.log(`   확신도: ${result2.confidence}%`);
  if (result2.selectedTier) {
    console.log(`   적용된 렌즈: ${result2.selectedTier.name}`);
    console.log(`   이유: ${result2.selectedTier.reason}`);
  }
} catch (error) {
  console.log(`❌ 에러: ${error.message}`);
}

console.log("\n📋 테스트 3: 수가 없는 사주 (병약용신 예상)");
console.log("사주: 甲寅 丙午 戊辰 庚申");
console.log("오행분포: 木2개, 火2개, 土2개, 金2개, 水0개 (수 고립)");
try {
  const result3 = analyzeYongsin(testSaju3);
  console.log(`✅ 결과: ${result3.summary}`);
  console.log(`   용신: ${result3.primaryYongsin}`);
  console.log(`   확신도: ${result3.confidence}%`);
  if (result3.selectedTier) {
    console.log(`   적용된 렌즈: ${result3.selectedTier.name}`);
    console.log(`   이유: ${result3.selectedTier.reason}`);
  }
} catch (error) {
  console.log(`❌ 에러: ${error.message}`);
}

console.log("\n" + "=".repeat(60));
console.log("🎯 시뮬레이션 완료!");
console.log("=".repeat(60));

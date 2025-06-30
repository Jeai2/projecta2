import { StarSection } from "./StarSection";
import { useFortuneStore } from "@/store/fortuneStore";
// import type { StarData } from "@/types/fortune";

// '살의'에 해당하는 목업 데이터
/* const mockSinsalData: StarData[] = [
  {
    name: "귀문관살 (鬼門關殺)",
    description: "예민함과 천재성의 양면성",
    details: "...",
    elements: [
      { pillar: "일주", type: "지지", character: "巳" },
      { pillar: "월주", type: "지지", character: "戌" },
    ],
    illustration: "/images/illustrations/sinsal_genius.png",
  },
]; */

export const SinsalSection = () => {
  // ✅ 3. 진짜 재료 창고에서 운세 결과를 꺼냅니다.
  const { fortuneResult } = useFortuneStore();

  // 실제 '살의' 데이터를 가져오고, 데이터가 없을 경우 빈 배열을 기본값으로 설정합니다.
  const sinsalData = fortuneResult?.saju.interpretation.sinsalAnalysis || [];

  return (
    <StarSection
      title="9. 살의(殺意) 분석"
      description="사주에 숨겨져 당신의 삶에 특별한 영향을 미치는 기운(살)들을 분석합니다."
      // ✅ '붕어빵 틀'에 진짜 재료를 넣어줍니다.
      data={sinsalData}
      noDataMessage="사주에 특별히 작용하는 살(殺)이 없습니다."
    />
  );
};

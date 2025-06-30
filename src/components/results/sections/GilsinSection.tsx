import { StarSection } from "./StarSection";
import { useFortuneStore } from "@/store/fortuneStore";
// import type { StarData } from "@/types/fortune";

/* // '길신'에 해당하는 목업 데이터
const mockGilsinData: StarData[] = [
  {
    name: "천을귀인 (天乙貴人)",
    description: "최고의 길신, 하늘의 도움",
    details:
      "천을귀인은 하늘의 은덕을 받는 최고의 길신으로, 어려움에 처했을 때 귀인이 나타나 도와주고 흉한 일을 피하게 해주는 강력한 기운입니다.",
    elements: [
      { pillar: "일주", type: "천간", character: "甲" },
      { pillar: "일지", type: "지지", character: "丑" },
    ],
    illustration: "/images/illustrations/gilsin_angel.png",
  },
]; */

export const GilsinSection = () => {
  // ✅ 3. 진짜 재료 창고에서 운세 결과를 꺼냅니다.
  const { fortuneResult } = useFortuneStore();

  const gilsinData = fortuneResult?.saju.interpretation.gilsinAnalysis || [];

  return (
    <StarSection
      title="10. 길신(吉神) 분석"
      description="당신의 삶에 긍정적인 영향을 주고 복을 가져다주는 귀한 기운들을 분석합니다."
      // ✅ '붕어빵 틀'에 진짜 재료를 넣어줍니다.
      data={gilsinData}
      noDataMessage="사주에 특별히 작용하는 길신(吉神)이 없습니다."
    />
  );
};

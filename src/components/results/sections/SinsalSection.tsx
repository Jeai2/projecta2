import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useFortuneStore } from "@/store/fortuneStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { SinsalSummaryCard } from "@/components/results/common/SinsalSummaryCard";
import { SinsalDetailModal } from "@/components/results/common/SinsalDetailModal";
import type { SinsalData } from "@/types/fortune"; // SinsalData 타입을 fortune.d.ts에서 관리한다고 가정

// ✅ 일러스트 필드를 포함하도록 목업 데이터 수정
const mockSinsalData: SinsalData[] = [
  {
    name: "진술충 (辰戌沖)",
    description: "이상과 현실의 충돌",
    details:
      "진술충은 같은 토(土) 기운끼리의 충돌로, '붕충(朋沖)'이라고도 합니다. 이는 주로 정신적인 갈등, 신념의 변화, 하던 일의 중단 및 새로운 시작 등을 의미합니다. 때로는 부동산이나 가까운 친구와의 문제로 나타나기도 합니다.",
    elements: ["辰", "戌"],
    illustration: "/images/illustrations/sinsal_conflict.png", // 이미지 경로 예시
  },
  {
    name: "귀문관살 (鬼門關殺)",
    description: "예민함과 천재성의 양면성",
    details:
      "귀문관살은 정신을 관장하는 문으로, 이 살이 있으면 직관력과 영감이 매우 발달하여 천재성을 보일 수 있습니다. 하지만 반대로 매우 예민하고 신경이 날카로워져 까다롭게 행동하거나 비현실적인 생각을 하기도 하는 양면성을 가집니다.",
    elements: ["巳", "戌"],
    illustration: "/images/illustrations/sinsal_genius.png",
  },
  // ... 다른 목업 데이터
];

export const SinsalSection = () => {
  const { fortuneResult } = useFortuneStore();
  // ✅ 어떤 카드가 선택되었는지 관리하는 상태
  const [selectedSinsal, setSelectedSinsal] = useState<SinsalData | null>(null);

  const sinsalData = mockSinsalData;

  return (
    <>
      <Card className="animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            9. 살의(殺意) 분석
          </CardTitle>
          <CardDescription>
            사주에 숨겨져 당신의 삶에 특별한 영향을 미치는 기운(살)들을
            분석합니다. 각 카드를 클릭하여 상세 설명을 확인해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sinsalData.map((sinsal) => (
            <SinsalSummaryCard
              key={sinsal.name}
              data={sinsal}
              // ✅ 클릭 시 해당 카드를 선택된 상태로 설정
              onClick={() => setSelectedSinsal(sinsal)}
              // ✅ [수정] 각 카드에 고유한 layoutId를 전달합니다.
              layoutId={`sinsal-card-${sinsal.name}`}
            />
          ))}
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedSinsal && (
          <SinsalDetailModal
            sinsal={selectedSinsal}
            onClose={() => setSelectedSinsal(null)}
            // ✅ [수정] 선택된 카드와 동일한 layoutId를 모달에 전달합니다.
            layoutId={`sinsal-card-${selectedSinsal.name}`}
          />
        )}
      </AnimatePresence>
    </>
  );
};

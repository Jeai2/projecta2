import { useFortuneStore } from "@/store/fortuneStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { AlertCircle } from "lucide-react";
import { SajuPillar } from "@/components/results/common/SajuPillar"; // SajuPillar 컴포넌트 import

export const SipsinSection = () => {
  const { fortuneResult } = useFortuneStore();

  const saju = fortuneResult?.saju;
  const sipsinAnalysis = saju?.interpretation?.sipsinAnalysis;

  // 1. 사주 데이터(sajuData)와 십신 해석(sipsinAnalysis)이 모두 있는지 확인
  if (!saju?.sajuData || !sipsinAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>5. 십신 분석 (사회적 관계와 재능)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-text-muted h-64">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>십신 분석 정보를 표시할 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { sajuData } = saju;

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">5. 십신(十神) 분석</CardTitle>
        <CardDescription>
          당신의 사회적 관계, 재능, 그리고 무의식적 욕구를 10가지 유형으로
          분석하여 당신의 다채로운 모습을 보여줍니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 2. 사주 원국표를 표시하는 코드 추가 */}
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          <SajuPillar title="시주" data={sajuData.pillars.hour} />
          <SajuPillar title="일주" data={sajuData.pillars.day} />
          <SajuPillar title="월주" data={sajuData.pillars.month} />
          <SajuPillar title="년주" data={sajuData.pillars.year} />
        </div>

        {/* 3. 원국표와 해석 텍스트를 구분하는 구분선 추가 */}
        <div className="border-t border-white/10 my-6"></div>

        <p className="whitespace-pre-wrap text-base leading-relaxed text-text-muted">
          {sipsinAnalysis}
        </p>
      </CardContent>
    </Card>
  );
};

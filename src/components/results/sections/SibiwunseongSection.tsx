import { useFortuneStore } from "@/store/fortuneStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { AlertCircle } from "lucide-react";
import { SajuPillar } from "@/components/results/common/SajuPillar";
import { titleToKey } from "@/lib/utils";

export const SibiwunseongSection = () => {
  const { fortuneResult } = useFortuneStore();

  const saju = fortuneResult?.saju;
  // 1. 'sibiwunseongAnalysis' 데이터에 접근합니다.
  const sibiwunseongAnalysis = saju?.interpretation?.sibiwunseongAnalysis;

  // 2. 사주 데이터와 십이운성 해석 데이터가 모두 있는지 확인합니다.
  if (!saju?.sajuData || !sibiwunseongAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>6. 십이운성 분석 (에너지의 흐름)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-text-muted h-64">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>십이운성 분석 정보를 표시할 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { sajuData } = saju;
  const { pillars } = sajuData;

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          6. 십이운성(十二運星) 분석
        </CardTitle>
        <CardDescription>
          인생의 12가지 단계를 통해 당신의 타고난 에너지의 강약과 흐름을
          분석합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 사주 원국표 표시 */}
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          {["시주", "일주", "월주", "년주"].map((title) => (
            <SajuPillar
              key={title}
              title={title}
              data={pillars[titleToKey(title)]}
            />
          ))}
        </div>

        {/* 구분선 */}
        <div className="border-t border-white/10 my-6"></div>

        {/* 3. 백엔드에서 생성된 해석을 표시합니다. */}
        <p className="whitespace-pre-wrap text-base leading-relaxed text-text-muted">
          {sibiwunseongAnalysis}
        </p>
      </CardContent>
    </Card>
  );
};

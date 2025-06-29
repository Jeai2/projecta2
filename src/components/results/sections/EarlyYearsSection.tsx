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

export const EarlyYearsSection = () => {
  const { fortuneResult } = useFortuneStore();

  const saju = fortuneResult?.saju;

  // 사주 원국표를 그리는 데 필요한 sajuData만 확인합니다.
  if (!saju?.sajuData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7. 초년운과 청년기운 (인생의 기반)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-text-muted h-64">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>데이터를 표시할 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { pillars } = saju.sajuData;

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          7. 초년운과 청년기운
        </CardTitle>
        <CardDescription>
          당신의 인생 전반부, 즉 초년(년주)과 청년(월주) 시절의 환경과 에너지를
          분석하여 인생의 기반을 살펴봅니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 초년(년주), 청년(월주)에 해당하는 기둥을 강조 */}
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          {["시주", "일주", "월주", "년주"].map((title) => (
            <SajuPillar
              key={title}
              title={title}
              data={pillars[titleToKey(title)]}
              isHighlighted={title === "년주" || title === "월주"}
              shouldDimOthers={true}
            />
          ))}
        </div>

        <div className="border-t border-white/10 my-6"></div>

        {/* 해석 내용은 백엔드 연동 전까지 임시로 처리 */}
        <div className="flex flex-col items-center justify-center text-center text-text-muted h-48 bg-background/30 rounded-lg">
          <AlertCircle className="w-10 h-10 mb-4" />
          <p className="font-semibold">해석 준비 중입니다.</p>
          <p className="text-sm mt-1">
            백엔드 해석 로직 추가 후 연동될 예정입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

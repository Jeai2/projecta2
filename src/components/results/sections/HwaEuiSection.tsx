// src/components/results/sections/HwaEuiSection.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { AlertCircle } from "lucide-react";

export const HwaEuiSection = () => {
  // 스토어에서 직접 운세 결과를 가져옵니다.
  const { fortuneResult } = useFortuneStore();

  // aiResponse가 없거나, 필요한 데이터가 없을 경우를 대비한 방어 코드
  if (
    !fortuneResult?.aiResponse?.imageUrl ||
    !fortuneResult?.aiResponse?.refinedText
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>2. 화의(畵意)</CardTitle>
          <CardDescription>
            사주를 통해 당신의 모습을 그려봅니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-text-muted h-64">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>화의(畵意) 정보를 불러오는 중이거나, 생성할 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 스토어에서 실제 데이터 추출
  const { imageUrl, refinedText } = fortuneResult.aiResponse;

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle>2. 화의(畵意)</CardTitle>
        <CardDescription>
          사주팔자를 한 폭의 그림으로 형상화하여 그 안에 담긴 의미를 해석합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI가 생성한 이미지를 표시 */}
        <div className="rounded-lg overflow-hidden border-2 border-accent-gold/20 aspect-video bg-background-sub">
          <img
            src={imageUrl}
            alt="사주 화의 이미지"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* AI가 생성한 텍스트 해석을 표시 */}
        <blockquote className="border-l-4 border-accent-gold pl-4 italic text-text-muted">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {refinedText}
          </p>
        </blockquote>
      </CardContent>
    </Card>
  );
};

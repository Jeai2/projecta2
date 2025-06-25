// src/components/results/sections/HwaEuiSection.tsx

import { useFortuneStore } from "@/store/fortuneStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";

export const HwaEuiSection = () => {
  // 스토어에서 직접 운세 결과를 가져옵니다.
  const { fortuneResult } = useFortuneStore();

  // aiResponse가 없을 경우를 대비한 방어 코드
  if (!fortuneResult?.aiResponse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>2. 화의(畵意)</CardTitle>
          <CardDescription>
            사주를 통해 당신의 모습을 그려봅니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-text-muted">
            화의(畵意) 정보를 불러올 수 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { imageUrl, refinedText } = fortuneResult.aiResponse;

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. 화의(畵意)</CardTitle>
        <CardDescription>
          사주팔자를 한 폭의 그림으로 형상화하여 그 안에 담긴 의미를 해석합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI가 생성한 이미지 */}
        <div className="rounded-lg overflow-hidden border-2 border-accent-gold/20 aspect-video">
          <img
            src={imageUrl}
            alt="사주 화의 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        {/* AI가 생성한 텍스트 해석 */}
        <div className="p-6 bg-background-sub rounded-md">
          <p className="text-base leading-relaxed whitespace-pre-wrap text-text-light">
            {refinedText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// src/components/results/FortuneResult.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/common/Card";
import type { FortuneResponseData } from "../../types/fortune";
import { Button } from "../ui/common/Button";

interface FortuneResultProps {
  data: FortuneResponseData | null;
  onReset: () => void;
}

export const FortuneResult: React.FC<FortuneResultProps> = ({
  data,
  onReset,
}) => {
  if (!data) {
    return (
      <div className="text-center text-text-muted">
        운세 결과를 불러오는 중입니다...
      </div>
    );
  }

  // ✅ 전체 데이터에서 필요한 부분을 쉽게 사용할 수 있도록 구조 분해 할당을 합니다.
  const { saju, aiResponse } = data;
  const { sajuData, interpretation } = saju;
  const { pillars } = sajuData;

  const { dayMasterNature } = interpretation;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* 섹션 1: 사주팔자 원국 표시 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            나의 사주 원국
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 text-center">
            {["시주", "일주", "월주", "년주"].map((title) => (
              <div key={title} className="font-semibold text-text-muted">
                {title}
              </div>
            ))}

            <div className="text-3xl font-bold">{pillars.hour[0]}</div>
            <div className="text-3xl font-bold text-accent-gold">
              {pillars.day[0]}
            </div>
            <div className="text-3xl font-bold">{pillars.month[0]}</div>
            <div className="text-3xl font-bold">{pillars.year[0]}</div>

            <div className="text-3xl font-bold">{pillars.hour[1]}</div>
            <div className="text-3xl font-bold">{pillars.day[1]}</div>
            <div className="text-3xl font-bold">{pillars.month[1]}</div>
            <div className="text-3xl font-bold">{pillars.year[1]}</div>
          </div>
        </CardContent>
      </Card>

      {/* ✅✅✅ 섹션 2: 일간 분석 카드 추가 ✅✅✅ */}
      <Card>
        <CardHeader>
          <CardTitle>타고난 나의 본질</CardTitle>
          <CardDescription>
            당신을 상징하는 핵심 기운, 일간({pillars.day[0]}) 분석
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {dayMasterNature.base}
          </p>
          {dayMasterNature.custom && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm font-semibold text-accent-gold mb-2">
                화의론(畵意論) 관점
              </p>
              <p className="text-base leading-relaxed text-text-muted whitespace-pre-wrap">
                {dayMasterNature.custom}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 앞으로 여기에 다른 해석 카드들이 순서대로 추가될 것입니다. */}

      {/* 다시 분석하기 버튼 */}
      <div className="text-center pt-8">
        <Button onClick={onReset} variant="outline">
          다른 사주 분석하기
        </Button>
      </div>
    </div>
  );
};

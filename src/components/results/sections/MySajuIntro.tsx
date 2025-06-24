// src/components/results/sections/MySajuIntro.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import type { SajuData, InterpretationResult } from "@/types/fortune";

interface MySajuIntroProps {
  sajuData: SajuData;
  interpretation: InterpretationResult;
}

export const MySajuIntro: React.FC<MySajuIntroProps> = ({
  sajuData,
  interpretation,
}) => {
  const { pillars } = sajuData;
  const { dayMasterNature } = interpretation;

  return (
    // 두 카드를 하나의 섹션으로 묶습니다.
    <section className="space-y-8">
      {/* ================================================================= */}
      {/* 이 부분은 기존 FortuneResult.tsx에서 그대로 복사해 온 것입니다. */}
      {/* ================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            나의 사주 원국
          </CardTitle>
          <CardDescription className="text-center pt-1">
            당신이 태어난 생년월일시를 바탕으로 구성된 하늘과 땅의 기운입니다.
          </CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>내 사주, 나는 누구인가?</CardTitle>
          <CardDescription>
            당신을 상징하는 핵심 기운, 일간({pillars.day[0]}) 분석
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {dayMasterNature.base}
          </p>
          {dayMasterNature.custom && (
            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-sm font-semibold text-accent-gold mb-2">
                심층 분석
              </p>
              <p className="text-base leading-relaxed text-text-muted whitespace-pre-wrap">
                {dayMasterNature.custom}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* ================================================================= */}
      {/* 여기까지가 복사한 내용입니다. */}
      {/* ================================================================= */}
    </section>
  );
};

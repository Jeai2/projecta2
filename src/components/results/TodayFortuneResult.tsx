// src/components/results/TodayFortuneResult.tsx
// 오늘의 운세 전용 결과 컴포넌트 (일진 기반)

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/common/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/common/Tabs";
import { Button } from "../ui/common/Button";
import type { TodayFortuneResponse } from "../../types/today-fortune";

interface TodayFortuneResultProps {
  data: TodayFortuneResponse | null;
  onReset: () => void;
}

export const TodayFortuneResult: React.FC<TodayFortuneResultProps> = ({
  data,
  onReset,
}) => {
  if (!data || !data.iljin || !data.fortune) {
    return (
      <div className="text-center text-text-muted">
        운세 결과를 불러오는 중입니다...
      </div>
    );
  }

  const { iljin, fortune } = data;

  // 오행 → 색상 클래스 매핑
  const ohaengToColorClass: Record<string, string> = {
    木: "text-green-400",
    火: "text-red-400",
    土: "text-yellow-400",
    金: "text-gray-300",
    水: "text-blue-400",
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* 헤더 섹션 제거 → 이미지 영역을 날짜/일진 카드 내부로 이동 */}

      {/* 오늘 날짜 일진 */}
      <Card className="border-accent-gold/20 bg-gradient-to-br from-accent-gold/5 to-transparent">
        <CardHeader>
          {/* 프로필형 이미지 영역 (날짜/일진 카드 상단) */}
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 border border-white/20 bg-gradient-to-br from-accent-gold/10 to-transparent flex items-center justify-center text-xs text-text-muted shadow-lg">
              이미지
            </div>
          </div>
          <CardDescription className="text-center">
            {iljin.date} (
            {new Date(iljin.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
            )
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-accent-gold">
              {iljin.ganji}
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-sm text-text-muted">천간</div>
                <div
                  className={`text-2xl font-bold flex items-baseline justify-center gap-1 ${
                    ohaengToColorClass[iljin.ohaeng.gan] || ""
                  }`}
                >
                  <span>{iljin.gan}</span>
                  <span
                    className={`text-sm ${
                      ohaengToColorClass[iljin.ohaeng.gan] || "text-text-muted"
                    }`}
                  >
                    {iljin.ohaeng.gan}
                  </span>
                </div>
                <div className="text-xs mt-1">
                  <span className="text-accent-gold font-medium">
                    {data.sipsinOfToday?.gan || "-"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-text-muted">지지</div>
                <div
                  className={`text-2xl font-bold flex items-baseline justify-center gap-1 ${
                    ohaengToColorClass[iljin.ohaeng.ji] || ""
                  }`}
                >
                  <span>{iljin.ji}</span>
                  <span
                    className={`text-sm ${
                      ohaengToColorClass[iljin.ohaeng.ji] || "text-text-muted"
                    }`}
                  >
                    {iljin.ohaeng.ji}
                  </span>
                </div>
                <div className="text-xs mt-1">
                  <span className="text-accent-gold font-medium">
                    {data.sipsinOfToday?.ji || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 운세 (한줄 요약 + 총평) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            ✨ 운세
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 한줄 요약 */}
          <div className="text-center">
            <p className="text-sm font-semibold text-accent-gold mb-2">
              한줄 요약
            </p>
            <p className="text-base leading-relaxed">{fortune.summary}</p>
          </div>

          {/* 총평 */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm font-semibold text-accent-gold mb-2">총평</p>
            <p className="text-sm leading-relaxed">{fortune.general}</p>
          </div>
        </CardContent>
      </Card>

      {/* 주제별 운세 - 탭 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            📚 주제별 운세
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="health" className="w-full">
            <TabsList className="flex flex-wrap gap-2 justify-center">
              <TabsTrigger value="health">건강</TabsTrigger>
              <TabsTrigger value="money">재물</TabsTrigger>
              <TabsTrigger value="love">연애</TabsTrigger>
              <TabsTrigger value="work">직장</TabsTrigger>
              <TabsTrigger value="relations">관계</TabsTrigger>
              <TabsTrigger value="documents">문서</TabsTrigger>
            </TabsList>
            <TabsContent value="health">
              <div className="p-4 border border-white/10 rounded-lg text-sm leading-relaxed">
                {fortune.health}
              </div>
            </TabsContent>
            <TabsContent value="money">
              <div className="p-4 border border-white/10 rounded-lg text-sm leading-relaxed">
                {fortune.money}
              </div>
            </TabsContent>
            <TabsContent value="love">
              <div className="p-4 border border-white/10 rounded-lg text-sm leading-relaxed">
                {fortune.love}
              </div>
            </TabsContent>
            <TabsContent value="work">
              <div className="p-4 border border-white/10 rounded-lg text-sm leading-relaxed">
                {fortune.work}
              </div>
            </TabsContent>
            <TabsContent value="relations">
              <div className="p-4 border border-white/10 rounded-lg text-sm leading-relaxed">
                {(fortune as any).relations || "-"}
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <div className="p-4 border border-white/10 rounded-lg text-sm leading-relaxed">
                {(fortune as any).documents || "-"}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 길한 것들 / 피해야 할 것들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 길한 것들 */}
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-center text-green-400">
              🍀 길한 것들
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">방향:</span>
              <span className="text-sm font-medium">
                {fortune.lucky.direction}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">색상:</span>
              <span className="text-sm font-medium">{fortune.lucky.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">숫자:</span>
              <span className="text-sm font-medium">
                {fortune.lucky.number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">시간:</span>
              <span className="text-sm font-medium">{fortune.lucky.time}</span>
            </div>
          </CardContent>
        </Card>

        {/* 피해야 할 것들 */}
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-center text-red-400">
              ⚠️ 피해야 할 것들
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">방향:</span>
              <span className="text-sm font-medium">
                {fortune.avoid.direction}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">색상:</span>
              <span className="text-sm font-medium">{fortune.avoid.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">시간:</span>
              <span className="text-sm font-medium">{fortune.avoid.time}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 오늘의 조언 */}
      <Card className="border-accent-gold/30 bg-gradient-to-br from-accent-gold/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-center text-accent-gold">
            💫 오늘의 조언
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-base leading-relaxed">
            {fortune.advice}
          </p>
        </CardContent>
      </Card>

      {/* 다시 분석하기 버튼 */}
      <div className="text-center pt-8">
        <Button onClick={onReset} variant="outline" size="lg">
          다른 날 운세 보기
        </Button>
      </div>
    </div>
  );
};

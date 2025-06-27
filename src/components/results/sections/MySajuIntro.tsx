// src/components/results/sections/MySajuIntro.tsx (Zustand 적용 최종본)

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { useFortuneStore } from "@/store/fortuneStore"; // ✅ 1. 스토어 import
import { SajuPillar } from "../common/SajuPillar"; // ✅ 상세 기둥 타입을 import
import { AlertCircle } from "lucide-react";

export const MySajuIntro = () => {
  // ✅ 3. 스토어에서 직접 모든 데이터를 가져옵니다.
  const { fortuneResult } = useFortuneStore();

  // 데이터가 없는 경우를 대비한 방어 코드
  if (!fortuneResult || !fortuneResult.saju?.sajuData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3. 나의 사주 원국</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-text-muted h-64">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>사주 정보를 표시할 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 필요한 데이터를 fortuneResult에서 추출합니다.
  const { sajuData } = fortuneResult.saju;

  return (
    // ✅ space-y-8 클래스를 제거하여 카드 간의 간격을 없앱니다.
    <div className="animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            3. 사주 원국 표 (기둥 정보)
          </CardTitle>
          <CardDescription>
            타고난 당신의 본질을 담고 있는 8개의 글자입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background-sub p-4 rounded-lg">
            <div className="grid grid-cols-5 gap-2 items-start">
              {/* 라벨 열 */}
              <div className="text-right text-xs font-semibold text-text-muted space-y-1 pr-2">
                <div className="h-7"></div>
                <div className="h-5 flex items-center justify-end">
                  십성(天)
                </div>
                <div className="h-12 flex items-center justify-end">천간</div>
                <div className="h-12 flex items-center justify-end">지지</div>
                <div className="h-5 flex items-center justify-end pt-1">
                  십성(地)
                </div>
                <div className="h-5 flex items-center justify-end">
                  십이운성
                </div>
                <div className="h-5 flex items-center justify-end">
                  십이신살
                </div>
                <div className="h-5 flex items-center justify-end">귀인</div>
              </div>
              {/* 각 기둥 컴포넌트 조립 */}
              <SajuPillar title="시주(時)" data={sajuData.pillars.hour} />
              <SajuPillar title="일주(日)" data={sajuData.pillars.day} />
              <SajuPillar title="월주(月)" data={sajuData.pillars.month} />
              <SajuPillar title="년주(年)" data={sajuData.pillars.year} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ [제거] '타고난 나의 본질'을 보여주던 두 번째 Card와 Accordion UI를 모두 삭제했습니다. */}
    </div>
  );
};

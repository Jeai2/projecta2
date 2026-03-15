// src/pages/CoupleGungapPage.tsx

import { useState } from "react";
import axios from "axios";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { CoupleGungapForm } from "@/components/forms/CoupleGungapForm";
import { CoupleResult } from "@/components/results/CoupleResult";
import type { CoupleFormData } from "@/components/forms/CoupleGungapForm";
import type { FortuneResponseData } from "@/types/fortune";

const toApiGender = (g: string) => (g === "male" ? "M" : "W");

const CoupleGungapPage = () => {
  const [showResult, setShowResult] = useState(false);
  const [myFortune, setMyFortune] = useState<FortuneResponseData | null>(null);
  const [partnerFortune, setPartnerFortune] =
    useState<FortuneResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleFortuneSubmit = async (data: CoupleFormData) => {
    setIsLoading(true);
    setApiError(null);
    const me = data.me;
    const partner = data.partner;

    const toBody = (p: typeof me) => {
      const base = {
        name: "",
        gender: toApiGender(p.gender),
        calendarType: p.calendarType,
        birthDate: `${p.birthYear}-${p.birthMonth}-${p.birthDay}`,
        birthPlace: "",
      };
      // 생시 미입력(8자리) 시 birthTime 생략 → 서버 timeUnknown: true
      if (p.birthTime && p.birthTime.trim() !== "") {
        return { ...base, birthTime: p.birthTime };
      }
      return base;
    };

    try {
      const [meRes, partnerRes] = await Promise.all([
        axios.post<FortuneResponseData>("/api/fortune/manse", toBody(me)),
        axios.post<FortuneResponseData>("/api/fortune/manse", toBody(partner)),
      ]);
      setMyFortune(meRes.data);
      setPartnerFortune(partnerRes.data);
      setShowResult(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setApiError(err.response.data?.message || "오류가 발생했습니다.");
      } else {
        setApiError("알 수 없는 오류가 발생했습니다.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setMyFortune(null);
    setPartnerFortune(null);
    setApiError(null);
  };

  return (
    <FortunePageLayout
      title="커플 궁합"
      description="나와 상대방의 사주를 통해 알아보는 환상의 케미"
      contentWrapperClassName="p-0 bg-transparent"
    >
      {showResult && myFortune && partnerFortune ? (
        <CoupleResult
          myFortune={myFortune}
          partnerFortune={partnerFortune}
          onReset={handleReset}
        />
      ) : (
        <div className="space-y-4">
          <CoupleGungapForm
            onSubmit={handleFortuneSubmit}
            isLoading={isLoading}
          />
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-text-muted">
              <div className="w-4 h-4 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
              사주 분석 중...
            </div>
          )}
          {apiError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              <p className="text-sm text-red-400">{apiError}</p>
            </div>
          )}
        </div>
      )}
    </FortunePageLayout>
  );
};

export default CoupleGungapPage;
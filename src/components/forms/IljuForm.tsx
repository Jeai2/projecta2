// src/components/forms/IljuForm.tsx
// 일주론 전용 입력 폼 컴포넌트

import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/common/Button";
import { Label } from "../ui/common/Label";
import { Input } from "../ui/common/Input";
import { RadioGroup, RadioGroupItem } from "../ui/common/RadioGroup";
import { Card, CardContent } from "../ui/common/Card";

interface IljuFormData {
  gender: "M" | "W";
  calendarType: "solar" | "lunar";
  birthDate: string; // YYYY-MM-DD
}

interface IljuResponseData {
  data: {
    iljuData: {
      name: string;
      characteristic: string; // 성격+성향 통합
      career: string;
      spouse: string;
      wealth: string;
      health: string;
    };
    dayGan: string;
    dayJi: string;
    dayGanji: string;
    gender?: "M" | "W";
  };
}

interface IljuFormProps {
  onResult?: (result: IljuResponseData["data"]) => void;
}

export const IljuForm: React.FC<IljuFormProps> = ({ onResult }) => {
  const [gender, setGender] = useState<"M" | "W">("M");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [birthDate, setBirthDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 생년월일 입력 핸들러
  const handleBirthDateChange = (value: string) => {
    // 숫자만 입력 허용
    const numericValue = value.replace(/[^0-9]/g, "");

    // 8자리까지만 입력 허용
    if (numericValue.length <= 8) {
      setBirthDate(numericValue);
    }
  };

  // 자동 띄어쓰기 포맷팅 함수
  const formatBirthDate = (value: string) => {
    if (value.length === 0) return "";
    if (value.length <= 4) return value;
    if (value.length <= 6) return `${value.slice(0, 4)} ${value.slice(4)}`;
    return `${value.slice(0, 4)} ${value.slice(4, 6)} ${value.slice(6)}`;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 8자리(YYYYMMDD)만 허용
    if (birthDate.length !== 8) {
      setApiError("8자리로 입력해주세요. (예: 20250101)");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    // 생년월일 파싱
    const birthYear = birthDate.slice(0, 4);
    const birthMonth = birthDate.slice(4, 6);
    const birthDay = birthDate.slice(6, 8);

    const requestBody = {
      gender,
      calendarType,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
    };

    try {
      console.log("📤 일주론 서버로 보내는 요청 데이터:", requestBody);
      const response = await axios.post<IljuResponseData>(
        "/api/fortune/ilju",
        requestBody
      );
      console.log("📥 일주론 서버에서 받은 응답 데이터:", response.data);
      
      if (onResult) {
        onResult({ ...response.data.data, gender });
      } else {
        // fallback: 커스텀 이벤트
        window.dispatchEvent(
          new CustomEvent("iljuResult", { detail: { ...response.data.data, gender } })
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setApiError(err.response.data.message || "오류가 발생했습니다.");
      } else {
        setApiError("알 수 없는 오류가 발생했습니다.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border border-gray-200 bg-white shadow-lg rounded-3xl backdrop-blur-sm">
      <CardContent className="p-8 sm:p-10">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* 성별 및 양음력 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-semibold">성별</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as "M" | "W")}
                className="grid grid-cols-2 gap-3"
              >
                <Label htmlFor="ilju-male" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="M" id="ilju-male" />
                    남성
                  </div>
                </Label>
                <Label htmlFor="ilju-female" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="W" id="ilju-female" />
                    여성
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 font-semibold">양력/음력</Label>
              <RadioGroup
                value={calendarType}
                onValueChange={(value) =>
                  setCalendarType(value as "solar" | "lunar")
                }
                className="grid grid-cols-2 gap-3"
              >
                <Label htmlFor="ilju-solar" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="solar" id="ilju-solar" />
                    양력
                  </div>
                </Label>
                <Label htmlFor="ilju-lunar" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="lunar" id="ilju-lunar" />
                    음력
                  </div>
                </Label>
              </RadioGroup>
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div className="space-y-2">
            <Label className="text-gray-600 font-semibold">생년월일</Label>
            <Input
              type="text"
              placeholder="YYYYMMDD"
              value={formatBirthDate(birthDate)}
              onChange={(e) => handleBirthDateChange(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-2xl text-center font-mono text-lg tracking-wider"
              maxLength={11} // 포맷팅된 길이 (YYYY MM DD)
            />
            <p className="text-xs text-gray-500">
              💡 생년월일을 8자리 숫자로 입력해주세요.
            </p>
            <div className="text-xs text-accent-gold">
              📝 형식: YYYYMMDD (예: 20250101)
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-2xl"
              size="lg"
              disabled={isLoading || birthDate.length !== 8}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  일주론 분석 중...
                </span>
              ) : (
                "분석 시작하기"
              )}
            </Button>
          </div>

          {/* 오류 메시지 */}
          {apiError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400 text-center">{apiError}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

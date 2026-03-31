// src/components/forms/UserInfoForm.tsx
// 사용자 정보 입력 폼 — IljuForm, TodayFortuneForm과 동일한 스타일

import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/common/Button";
import { Label } from "../ui/common/Label";
import { Input } from "../ui/common/Input";
import { RadioGroup, RadioGroupItem } from "../ui/common/RadioGroup";
import { Card, CardContent } from "../ui/common/Card";
import type { FortuneResponseData } from "../../types/fortune";
import { useFortuneStore } from "@/store/fortuneStore";

interface UserInfoFormProps {
  buttonText: string;
  onSuccess?: (data: FortuneResponseData) => void;
}

export const UserInfoForm = ({ buttonText, onSuccess }: UserInfoFormProps) => {
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState<"M" | "W">("M");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [birthDateTime, setBirthDateTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setFortuneResult } = useFortuneStore();

  const handleBirthDateTimeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 12) {
      setBirthDateTime(numericValue);
    }
  };

  const formatBirthDateTime = (value: string) => {
    if (value.length === 0) return "";
    if (value.length <= 4) return value;
    if (value.length <= 6) return `${value.slice(0, 4)} ${value.slice(4)}`;
    if (value.length <= 8)
      return `${value.slice(0, 4)} ${value.slice(4, 6)} ${value.slice(6)}`;
    return `${value.slice(0, 4)} ${value.slice(4, 6)} ${value.slice(
      6,
      8
    )} ${value.slice(8)}`;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (birthDateTime.length !== 8 && birthDateTime.length !== 12) {
      setApiError("8자리(생년월일) 또는 12자리(생년월일시)로 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    const birthYear = birthDateTime.slice(0, 4);
    const birthMonth = birthDateTime.slice(4, 6);
    const birthDay = birthDateTime.slice(6, 8);
    const birthTime =
      birthDateTime.length === 12
        ? `${birthDateTime.slice(8, 10)}:${birthDateTime.slice(10, 12)}`
        : "12:00";

    const requestBody = {
      name: userName.trim(),
      gender,
      calendarType,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      birthTime,
      birthPlace: "",
    };

    try {
      const response = await axios.post<FortuneResponseData>(
        "/api/fortune/manse",
        requestBody
      );
      setFortuneResult(response.data);
      onSuccess?.(response.data);
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

  const formId = "jonghap";

  return (
    <Card className="max-w-2xl mx-auto border border-gray-200 bg-white shadow-lg rounded-3xl backdrop-blur-sm">
      <CardContent className="p-8 sm:p-10">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-600 font-semibold">이름</Label>
            <Input
              type="text"
              placeholder="이름을 입력해 주세요 (선택)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-2xl text-center text-lg"
              maxLength={32}
              autoComplete="name"
            />
          </div>

          {/* 성별 및 양력/음력 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-semibold">성별</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as "M" | "W")}
                className="grid grid-cols-2 gap-3"
              >
                <Label htmlFor={`${formId}-male`} className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="M" id={`${formId}-male`} />
                    남성
                  </div>
                </Label>
                <Label htmlFor={`${formId}-female`} className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="W" id={`${formId}-female`} />
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
                <Label htmlFor={`${formId}-solar`} className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="solar" id={`${formId}-solar`} />
                    양력
                  </div>
                </Label>
                <Label htmlFor={`${formId}-lunar`} className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                    <RadioGroupItem value="lunar" id={`${formId}-lunar`} />
                    음력
                  </div>
                </Label>
              </RadioGroup>
            </div>
          </div>

          {/* 생년월일시 */}
          <div className="space-y-2">
            <Label className="text-gray-600 font-semibold">생년월일시</Label>
            <Input
              type="text"
              placeholder="YYYYMMDD 또는 YYYYMMDDHHMM"
              value={formatBirthDateTime(birthDateTime)}
              onChange={(e) => handleBirthDateTimeChange(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-2xl text-center font-mono text-lg tracking-wider"
              maxLength={15}
            />
            <p className="text-xs text-gray-500">
              💡 생시(生時)를 모른다면 생략해주세요. (8자리만 입력)
            </p>
            <div className="text-xs text-accent-gold">
              📝 형식: YYYYMMDD / YYYYMMDDHHMM (예: 19950101 또는 199501011430)
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-2xl"
              size="lg"
              disabled={isLoading || birthDateTime.length < 8}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {buttonText.replace("보기", "계산 중...")}
                </span>
              ) : (
                buttonText
              )}
            </Button>
          </div>

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

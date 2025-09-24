// src/components/forms/ManseForm.tsx
// 만세력 서비스 전용 입력 폼 컴포넌트

import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/common/Button";
import { Label } from "../ui/common/Label";
import { Input } from "../ui/common/Input";
import { RadioGroup, RadioGroupItem } from "../ui/common/RadioGroup";
import { Card, CardContent } from "../ui/common/Card";
import type { FortuneResponseData } from "../../types/fortune";
import { useFortuneStore } from "@/store/fortuneStore";

// ✅ 만세력 전용 데이터

export const ManseForm = () => {
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<"M" | "W">("M");
  const [calendarType, setCalendarType] = useState("solar");
  const [birthDateTime, setBirthDateTime] = useState<string>("");
  const [birthPlace, setBirthPlace] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { setFortuneResult } = useFortuneStore();

  // 생년월일시 입력 핸들러
  const handleBirthDateTimeChange = (value: string) => {
    // 숫자만 입력 허용
    const numericValue = value.replace(/[^0-9]/g, "");

    // 12자리까지만 입력 허용
    if (numericValue.length <= 12) {
      setBirthDateTime(numericValue);
    }
  };

  // 자동 띄어쓰기 포맷팅 함수
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

    // 8자리(YYYYMMDD) 또는 12자리(YYYYMMDDHHMM)만 허용
    if (birthDateTime.length !== 8 && birthDateTime.length !== 12) {
      setApiError(
        "8자리 또는 12자리로만 입력해주세요. (예: 20250101 또는 202501011200)"
      );
      return;
    }

    setIsLoading(true);
    setApiError(null);

    // 생년월일시 파싱
    const birthYear = birthDateTime.slice(0, 4);
    const birthMonth = birthDateTime.slice(4, 6);
    const birthDay = birthDateTime.slice(6, 8);
    const birthTime =
      birthDateTime.length === 12 ? birthDateTime.slice(8, 12) : "";

    // 시간 형식 변환 (HHMM → HH:MM)
    const formattedTime =
      birthTime && birthTime.length === 4
        ? `${birthTime.slice(0, 2)}:${birthTime.slice(2, 4)}`
        : "";

    const requestBody = {
      name: name.trim() || "", // 빈 문자열로 전송
      gender,
      calendarType,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      birthTime: formattedTime,
      birthPlace: birthPlace.trim() || "", // 빈 문자열로 전송
    };

    try {
      console.log("📤 서버로 보내는 요청 데이터:", requestBody);
      const response = await axios.post<FortuneResponseData>(
        "/api/fortune/manse",
        requestBody
      );
      console.log("📥 서버에서 받은 응답 데이터:", response.data);
      setFortuneResult(response.data);
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
    <Card className="max-w-2xl mx-auto border-none bg-transparent shadow-none backdrop-blur-none">
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* 1. 이름 작성칸 */}
          <div className="space-y-3">
            <Label className="text-text-light font-semibold">이름</Label>
            <Input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background-main border-border-muted"
            />
          </div>

          {/* 2. 성별 및 양력/음력 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-text-light font-semibold">성별</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as "M" | "W")}
                className="flex gap-6 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="manse-male" />
                  <Label htmlFor="manse-male" className="text-text-light">
                    남성
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="W" id="manse-female" />
                  <Label htmlFor="manse-female" className="text-text-light">
                    여성
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-text-light font-semibold">양력/음력</Label>
              <RadioGroup
                value={calendarType}
                onValueChange={setCalendarType}
                className="flex gap-6 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solar" id="manse-solar" />
                  <Label htmlFor="manse-solar" className="text-text-light">
                    양력
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lunar" id="manse-lunar" />
                  <Label htmlFor="manse-lunar" className="text-text-light">
                    음력
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. 생년월일시 */}
          <div className="space-y-3">
            <Label className="text-text-light font-semibold">생년월일시</Label>
            <Input
              type="text"
              placeholder=" YYYYMMDD 또는 YYYYMMDDHHMM"
              value={formatBirthDateTime(birthDateTime)}
              onChange={(e) => handleBirthDateTimeChange(e.target.value)}
              className="bg-background-main border-border-muted text-center font-mono text-lg tracking-wider"
              maxLength={15} // 띄어쓰기 포함해서 15자리
            />
            <p className="text-xs text-text-muted">
              💡 8자리 또는 12자리로 입력하세요.
            </p>
            <div className="text-xs text-accent-gold">
              📝 형식: YYYYMMDD / YYYYMMDDHHMM (시간 선택 입력)
            </div>
          </div>

          {/* 5. 출생지 (선택사항) */}
          <div className="space-y-3">
            <Label className="text-text-light font-semibold">
              출생지 (선택사항)
            </Label>
            <Input
              type="text"
              placeholder="출생지를 입력해주세요 (예: 서울, 부산)"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="bg-background-main border-border-muted"
            />
            <p className="text-xs text-text-muted">
              💡 출생지는 정확한 사주 계산에 도움이 됩니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-accent-gold hover:bg-accent-gold/80 text-white font-semibold py-3"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  만세력 계산 중...
                </span>
              ) : (
                "만세력 보러가기"
              )}
            </Button>
            {/* 저장된 만세력 보기 버튼 */}
            <div className="mt-3">
              <Button
                type="button"
                className="w-full bg-accent-gold hover:bg-accent-gold/80 text-white font-semibold py-3"
                size="lg"
                onClick={() => {
                  // TODO: 저장소/보관함 페이지로 이동 또는 모달 열기
                  console.log("만세력 불러오기 클릭");
                }}
              >
                만세력 불러오기
              </Button>
            </div>
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

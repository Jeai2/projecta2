// src/components/forms/CoupleGungapForm.tsx
// IljuForm, UserInfoForm과 동일한 스타일로 통일

import React, { useState } from "react";
import { Button } from "@/components/ui/common/Button";
import { Label } from "@/components/ui/common/Label";
import { Input } from "@/components/ui/common/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/common/RadioGroup";
import { Card, CardContent } from "@/components/ui/common/Card";
import type { UserInfoSchema } from "@/lib/schemas";

export type CoupleFormData = {
  me: UserInfoSchema;
  partner: UserInfoSchema;
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

interface PersonSectionProps {
  type: "me" | "partner";
  gender: "male" | "female";
  setGender: (v: "male" | "female") => void;
  calendarType: "solar" | "lunar";
  setCalendarType: (v: "solar" | "lunar") => void;
  birthDateTime: string;
  setBirthDateTime: (v: string) => void;
  error: string | null;
}

const PersonSection: React.FC<PersonSectionProps> = ({
  type,
  gender,
  setGender,
  calendarType,
  setCalendarType,
  birthDateTime,
  setBirthDateTime,
  error,
}) => {
  const title = type === "me" ? "나의 정보 입력" : "상대방 정보 입력";
  const formId = `couple-${type}`;

  const handleBirthDateTimeChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length <= 12) setBirthDateTime(numericValue);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-600 font-semibold">성별</Label>
          <RadioGroup
            value={gender}
            onValueChange={(v) => setGender(v as "male" | "female")}
            className="grid grid-cols-2 gap-3"
          >
            <Label htmlFor={`${formId}-male`} className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                <RadioGroupItem value="male" id={`${formId}-male`} />
                남성
              </div>
            </Label>
            <Label htmlFor={`${formId}-female`} className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3 text-gray-700 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white">
                <RadioGroupItem value="female" id={`${formId}-female`} />
                여성
              </div>
            </Label>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-600 font-semibold">양력/음력</Label>
          <RadioGroup
            value={calendarType}
            onValueChange={(v) => setCalendarType(v as "solar" | "lunar")}
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
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    </div>
  );
};

interface CoupleGungapFormProps {
  onSubmit: (data: CoupleFormData) => void;
  isLoading?: boolean;
}

export const CoupleGungapForm: React.FC<CoupleGungapFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [meGender, setMeGender] = useState<"male" | "female">("male");
  const [meCalendar, setMeCalendar] = useState<"solar" | "lunar">("solar");
  const [meBirth, setMeBirth] = useState("");
  const [partnerGender, setPartnerGender] = useState<"male" | "female">("female");
  const [partnerCalendar, setPartnerCalendar] = useState<"solar" | "lunar">(
    "solar"
  );
  const [partnerBirth, setPartnerBirth] = useState("");
  const [meError, setMeError] = useState<string | null>(null);
  const [partnerError, setPartnerError] = useState<string | null>(null);

  const parseBirthDateTime = (value: string) => {
    if (value.length !== 8 && value.length !== 12) return null;
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    const time =
      value.length === 12
        ? `${value.slice(8, 10)}:${value.slice(10, 12)}`
        : undefined;
    return { birthYear: year, birthMonth: month, birthDay: day, birthTime: time };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMeError(null);
    setPartnerError(null);

    const meParsed = parseBirthDateTime(meBirth);
    const partnerParsed = parseBirthDateTime(partnerBirth);

    if (!meParsed) {
      setMeError("8자리(생년월일) 또는 12자리(생년월일시)로 입력해주세요.");
      return;
    }
    if (!partnerParsed) {
      setPartnerError("8자리(생년월일) 또는 12자리(생년월일시)로 입력해주세요.");
      return;
    }

    onSubmit({
      me: {
        gender: meGender,
        calendarType: meCalendar,
        birthYear: meParsed.birthYear,
        birthMonth: meParsed.birthMonth,
        birthDay: meParsed.birthDay,
        birthTime: meParsed.birthTime,
      },
      partner: {
        gender: partnerGender,
        calendarType: partnerCalendar,
        birthYear: partnerParsed.birthYear,
        birthMonth: partnerParsed.birthMonth,
        birthDay: partnerParsed.birthDay,
        birthTime: partnerParsed.birthTime,
      },
    });
  };

  const canSubmit =
    meBirth.length >= 8 && partnerBirth.length >= 8;

  return (
    <Card className="max-w-2xl mx-auto border border-gray-200 bg-white shadow-lg rounded-3xl backdrop-blur-sm">
      <CardContent className="p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          <PersonSection
            type="me"
            gender={meGender}
            setGender={setMeGender}
            calendarType={meCalendar}
            setCalendarType={setMeCalendar}
            birthDateTime={meBirth}
            setBirthDateTime={setMeBirth}
            error={meError}
          />
          <PersonSection
            type="partner"
            gender={partnerGender}
            setGender={setPartnerGender}
            calendarType={partnerCalendar}
            setCalendarType={setPartnerCalendar}
            birthDateTime={partnerBirth}
            setBirthDateTime={setPartnerBirth}
            error={partnerError}
          />
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-2xl"
              size="lg"
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? "분석 중..." : "커플궁합 보기"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

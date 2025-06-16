// src/components/forms/UserInfoForm.tsx

import React, { useState } from 'react'; // ✅ React.FormEvent를 위해 React를 import
import { Button } from "../ui/common/Button";
import { Label } from "../ui/common/Label";
import { RadioGroup, RadioGroupItem } from "../ui/common/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/common/Select";

// ✅ 1. 드롭다운에 필요한 데이터들을 미리 생성한다.
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1930 + 1 },
  (_, i) => 1930 + i
).reverse();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const TIMES = [
  { value: "unknown", label: "모름" },
  { value: "00:30-02:29", label: "子(자)시 (23:30~01:29)" },
  { value: "02:30-04:29", label: "丑(축)시 (01:30~03:29)" },
  { value: "04:30-06:29", label: "寅(인)시 (03:30~05:29)" },
  { value: "06:30-08:29", label: "卯(묘)시 (05:30~07:29)" },
  { value: "08:30-10:29", label: "辰(진)시 (07:30~09:29)" },
  { value: "10:30-12:29", label: "巳(사)시 (09:30~11:29)" },
  { value: "12:30-14:29", label: "午(오)시 (11:30~13:29)" },
  { value: "14:30-16:29", label: "未(미)시 (13:30~15:29)" },
  { value: "16:30-18:29", label: "申(신)시 (15:30~17:29)" },
  { value: "18:30-20:29", label: "酉(유)시 (17:30~19:29)" },
  { value: "20:30-22:29", label: "戌(술)시 (19:30~21:29)" },
  { value: "22:30-23:29", label: "亥(해)시 (21:00~23:29)" },
];

export interface UserData {
  gender: string;
  calendarType: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  birthTime?: string;
}

interface UserInfoFormProps {
  title: string;
  buttonText: string;
  onSubmit: (data: UserData) => void;
}

export const UserInfoForm = ({ title, buttonText, onSubmit }: UserInfoFormProps) => {
  const [gender, setGender] = useState("male");
  const [calendarType, setCalendarType] = useState("solar");
  const [birthYear, setBirthYear] = useState<string | undefined>();
  const [birthMonth, setBirthMonth] = useState<string | undefined>();
  const [birthDay, setBirthDay] = useState<string | undefined>();
  const [birthTime, setBirthTime] = useState<string | undefined>();

  // ✅ 표준 form 제출 함수로 변경
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData: UserData = {
      gender,
      calendarType,
      birthYear,
      birthMonth,
      birthDay,
      birthTime,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full bg-transparent p-1">
      <h3 className="text-h2-m text-center text-text-light mb-6">{title}</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>성별</Label>
            <RadioGroup
              value={gender}
              onValueChange={setGender}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id={`r-male-${title}`} />
                <Label htmlFor={`r-male-${title}`}>남자</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id={`r-female-${title}`} />
                <Label htmlFor={`r-female-${title}`}>여자</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>달력 종류</Label>
            <RadioGroup
              value={calendarType}
              onValueChange={setCalendarType}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solar" id={`r-solar-${title}`} />
                <Label htmlFor={`r-solar-${title}`}>양력</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lunar" id={`r-lunar-${title}`} />
                <Label htmlFor={`r-lunar-${title}`}>음력</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>생년</Label>
            <Select value={birthYear} onValueChange={setBirthYear}>
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>생월</Label>
            <Select value={birthMonth} onValueChange={setBirthMonth}>
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {month}월
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>생일</Label>
            <Select value={birthDay} onValueChange={setBirthDay}>
              <SelectTrigger>
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    {day}일
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>생시</Label>
          <Select value={birthTime} onValueChange={setBirthTime}>
            <SelectTrigger>
              <SelectValue placeholder="시간을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {TIMES.map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {buttonText && (
          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg">
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
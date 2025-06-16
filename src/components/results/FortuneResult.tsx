// src/components/results/FortuneResult.tsx

import React from 'react';
import type { UserData } from '../forms/UserInfoForm'; // UserInfoForm의 데이터 타입을 재활용한다.
import { Button } from '../ui/common/Button';

interface FortuneResultProps {
  data: UserData | null; // 전달받을 데이터
  onReset: () => void;  // '다시하기' 버튼을 위한 함수
}

export const FortuneResult: React.FC<FortuneResultProps> = ({ data, onReset }) => {
  if (!data) {
    return <div className="text-center text-text-muted">데이터가 없습니다.</div>;
  }

  return (
    <div className="bg-background-sub p-8 rounded-2xl text-text-light animate-in fade-in-50 duration-500">
      <h2 className="text-2xl font-bold text-center mb-6">운세 결과</h2>
      <div className="space-y-4">
        <p><strong>입력된 정보:</strong></p>
        <ul className="list-disc list-inside bg-background-main p-4 rounded-md">
          <li>성별: {data.gender === 'male' ? '남자' : '여자'}</li>
          <li>달력: {data.calendarType === 'solar' ? '양력' : '음력'}</li>
          <li>생년월일: {data.birthYear}년 {data.birthMonth}월 {data.birthDay}일</li>
          <li>생시: {data.birthTime}</li>
        </ul>
        <p className="pt-4">
          이 정보를 기반으로 한 상세 운세 내용이 여기에 표시될 것입니다.
        </p>
      </div>
      <div className="text-center mt-8">
        <Button onClick={onReset} variant="outline">다시하기</Button>
      </div>
    </div>
  );
};
// src/components/results/CoupleResult.tsx

import React from 'react';
import type { UserData } from '../forms/UserInfoForm';
import { Button } from '../ui/common/Button';

interface CoupleResultProps {
  myData: UserData | null;
  partnerData: UserData | null;
  onReset: () => void;
}

export const CoupleResult: React.FC<CoupleResultProps> = ({ myData, partnerData, onReset }) => {
  return (
    <div className="bg-background-sub p-8 rounded-2xl text-text-light animate-in fade-in-50 duration-500">
      <h2 className="text-2xl font-bold text-center mb-6">궁합 결과</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">나의 정보</p>
          <pre className="text-xs bg-background-main p-2 rounded mt-2 whitespace-pre-wrap break-words">
            {JSON.stringify(myData, null, 2)}
          </pre>
        </div>
        <div>
          <p className="font-semibold">상대방 정보</p>
          <pre className="text-xs bg-background-main p-2 rounded mt-2 whitespace-pre-wrap break-words">
            {JSON.stringify(partnerData, null, 2)}
          </pre>
        </div>
      </div>
      <div className="text-center mt-8">
        <Button onClick={onReset} variant="outline">다시하기</Button>
      </div>
    </div>
  );
};
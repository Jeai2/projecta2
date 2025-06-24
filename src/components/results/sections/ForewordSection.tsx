// src/components/results/sections/ForewordSection.tsx

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { Button } from "@/components/ui/common/Button";
import { Mail, X } from "lucide-react"; // 아이콘 추가

export const ForewordSection: React.FC = () => {
  // 편지가 열렸는지 여부를 추적하는 상태. 기본값은 false (닫힘).
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // 편지가 닫혀 있을 때 보여줄 UI
  if (!isLetterOpen) {
    return (
      <section
        className="flex flex-col items-center justify-center text-center p-8 bg-background-muted rounded-lg border border-border-muted cursor-pointer hover:bg-white/5 transition-colors duration-300"
        onClick={() => setIsLetterOpen(true)}
      >
        <Mail className="w-16 h-16 text-accent-gold mb-4" />
        <h3 className="text-xl font-bold">한 통의 편지가 도착했습니다</h3>
        <p className="text-text-muted mt-2">
          이곳을 클릭하여 서문을 읽어보세요.
        </p>
      </section>
    );
  }

  // 편지가 열렸을 때 보여줄 UI (애니메이션 효과 추가)
  return (
    <section className="animate-in fade-in-50 slide-in-from-top-10 duration-700">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>시작에 앞서</CardTitle>
              <CardDescription>
                제가 당신에게 꼭 전하고 싶은 이야기입니다.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLetterOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap leading-relaxed text-text-muted">
          {`이곳에 선생님께서 작성하실 서문 내용이 들어갑니다.

사주 명리학은 단순한 점술이 아닙니다.
그것은 자연의 거대한 순환 속에서 '나'라는 존재의 좌표를 이해하고,
삶의 지도를 얻는 과정입니다.

이 서비스는 당신의 사주팔자라는 고유한 설계도를 통해,
당신이 가진 무한한 가능성을 발견하고
더 나은 삶을 향해 나아갈 수 있도록 돕기 위해 만들어졌습니다.`}
        </CardContent>
      </Card>
    </section>
  );
};

// src/pages/AIConsultPage.tsx
// AI 상담 페이지 - 뤼튼 스타일 챗봇 플랫폼 레이아웃

import { MookAChat } from "@/components/chat/MookAChat";

const AIConsultPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* 상단: 로고/타이틀 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          AI 상담
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          화의명리 정령 묵설이와 대화해 보세요
        </p>
      </div>

      {/* 메인 콘텐츠: 채팅 영역 */}
      <div className="bg-white/60 rounded-2xl border border-gray-200 p-4 sm:p-6 min-h-[400px]">
        <MookAChat className="w-full" />
      </div>
    </div>
  );
};

export default AIConsultPage;

// src/components/results/IljuResult.tsx
// 일주론 결과 표시 컴포넌트

import React, { useState } from "react";

interface IljuResultData {
  iljuData: {
    name: string;
    profileImageUrl?: string;
    summary?: string;
    traits?: {
      base: string;
      psychological: string;
      emotionPattern: string;
    };
    careerDetail?: {
      features: string;
      direction: string;
      recommendedJobs: string;
      jobCategories?: {
        title: string;
        description: string;
        iconType: string;
      }[];
    };
    spouseDetail?: {
      male: {
        traits: string;
        points: string;
        traitsLabel?: string;
        pointsLabel?: string;
      };
      female: {
        traits: string;
        points: string;
        traitsLabel?: string;
        pointsLabel?: string;
      };
    };
    loveDetail?: {
      male: {
        style: string;
        needs: string;
      };
      female: {
        style: string;
        needs: string;
      };
    };
    overallSummary?: string;
    characteristic?: string; // legacy
    career?: string;
    spouse?: string;
    wealth?: string;
    health?: string;
  };
  dayGan: string;
  dayJi: string;
  dayGanji: string;
  gender?: "M" | "W";
}

interface IljuResultProps {
  iljuData: IljuResultData;
  onReset: () => void;
}

export const IljuResult: React.FC<IljuResultProps> = ({ iljuData, onReset }) => {
  const { iljuData: data, dayGan, dayJi, dayGanji, gender } = iljuData;
  const spouseKey = gender === "W" ? "female" : "male";
  const spouseDetail = data.spouseDetail?.[spouseKey];
  const loveDetail = data.loveDetail?.[spouseKey];
  const [activeCareerTab, setActiveCareerTab] = useState<"features" | "direction" | "recommendedJobs">("features");

  const spouseData = spouseDetail;
  const hanjaToOhaeng: Record<string, string> = {
    甲: "木",
    乙: "木",
    丙: "火",
    丁: "火",
    戊: "土",
    己: "土",
    庚: "金",
    辛: "金",
    壬: "水",
    癸: "水",
    子: "水",
    丑: "土",
    寅: "木",
    卯: "木",
    辰: "土",
    巳: "火",
    午: "火",
    未: "土",
    申: "金",
    酉: "金",
    戌: "土",
    亥: "水",
  };
  const ohaengColors: Record<string, string> = {
    木: "text-green-600",
    火: "text-red-600",
    土: "text-yellow-600",
    金: "text-gray-600",
    水: "text-blue-600",
  };
  const getOhaengColor = (character: string) => {
    const ohaeng = hanjaToOhaeng[character];
    return ohaengColors[ohaeng] || "text-gray-600";
  };

  const JobIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "education":
        return (
          <svg className="w-8 h-8 text-[#8FA197]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 10L12 5L2 10L12 15L22 10Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 12V17C6 17 9 19 12 19C15 19 18 17 18 17V12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "planning":
        return (
          <svg className="w-8 h-8 text-[#8FA197]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15 21L12 17L9 21L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 13H15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "art":
        return (
          <svg className="w-8 h-8 text-[#8FA197]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "research":
        return (
          <svg className="w-8 h-8 text-[#8FA197]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 8V11L13 13" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return <span className="text-2xl">💼</span>;
    }
  };

  return (
    <div className="bg-[#F7F3ED] -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 text-[#4b433a]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-[#D8D3C8] bg-[#EEF2EC] px-3 py-1 text-xs text-[#6C7B6A]">
          My Soul Vibe
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#4b433a]">
            {data.name}({dayGanji}) 일주
          </h1>
          {data.summary && (
            <p className="text-sm sm:text-base text-[#6B6258] max-w-xl mx-auto">
              “{data.summary}”
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <div className="relative">
            {data.profileImageUrl ? (
              <div className="w-52 h-52 rounded-full border border-[#E3DDD2] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08)] overflow-hidden flex items-center justify-center">
                <img
                  src={data.profileImageUrl}
                  alt={`${dayGanji} 프로필`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-2xl font-bold text-[#4b433a]">{dayGanji}</div>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-[#6B6258]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E3DDD2] bg-white px-3 py-1">
            <span className="text-[#8A8277]">일간</span>
            <span className={`text-lg font-semibold ${getOhaengColor(dayGan)}`}>
              {dayGan}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E3DDD2] bg-white px-3 py-1">
            <span className="text-[#8A8277]">일지</span>
            <span className={`text-lg font-semibold ${getOhaengColor(dayJi)}`}>
              {dayJi}
            </span>
          </div>
        </div>

        {/* 특징 */}
        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-[#E6D9CB] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2">
              <span className="text-[#8FA197]">💚</span>
              <h3 className="text-lg font-semibold text-[#4b433a]">
                나의 기본 성향은?
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6B6258]">
              <span className="rounded-full border border-[#EAE3D7] bg-[#F5F1EA] px-3 py-1">
                #기본성향
              </span>
              <span className="rounded-full border border-[#EAE3D7] bg-[#F5F1EA] px-3 py-1">
                #심리특징
              </span>
              <span className="rounded-full border border-[#EAE3D7] bg-[#F5F1EA] px-3 py-1">
                #감정패턴
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-[#5E564C] leading-relaxed">
              <div className="rounded-2xl border border-dashed border-[#E8DCCF] bg-[#FBF7F2] px-4 py-3">
                {data.traits?.base || data.characteristic || "-"}
              </div>
              <div className="rounded-2xl border border-dashed border-[#E8DCCF] bg-[#FBF7F2] px-4 py-3">
                {data.traits?.psychological || "-"}
              </div>
              <div className="rounded-2xl border border-dashed border-[#E8DCCF] bg-[#FBF7F2] px-4 py-3">
                {data.traits?.emotionPattern || "-"}
              </div>
            </div>
          </div>

          {/* 진로와 직업 - 탭 디자인 리뉴얼 */}
          <div className="rounded-3xl border border-[#E6D9CB] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
            {/* 탭 헤더 */}
            <div className="flex bg-[#F5F1EA] p-1.5 rounded-2xl mb-6">
              <button
                onClick={() => setActiveCareerTab("features")}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeCareerTab === "features"
                    ? "bg-white text-[#4b433a] shadow-sm"
                    : "text-[#9A9084] hover:text-[#6B6258]"
                }`}
              >
                강점
              </button>
              <button
                onClick={() => setActiveCareerTab("direction")}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeCareerTab === "direction"
                    ? "bg-white text-[#4b433a] shadow-sm"
                    : "text-[#9A9084] hover:text-[#6B6258]"
                }`}
              >
                방향
              </button>
              <button
                onClick={() => setActiveCareerTab("recommendedJobs")}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                  activeCareerTab === "recommendedJobs"
                    ? "bg-white text-[#4b433a] shadow-sm"
                    : "text-[#9A9084] hover:text-[#6B6258]"
                }`}
              >
                추천직업
              </button>
            </div>

            {/* 메인 비주얼 영역 (탭에 따라 가변) */}
            <div className="mb-8">
              {activeCareerTab === "recommendedJobs" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(data.careerDetail?.jobCategories || [
                    { title: "교육 및 멘토링", description: "지식을 전달하는 일", iconType: "education" },
                    { title: "기획 및 전략", description: "새로운 판을 짜는 일", iconType: "planning" }
                  ]).map((cat, idx) => (
                    <div key={idx} className="bg-white border border-[#E6D9CB] rounded-[2rem] p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="mb-5 p-4 rounded-2xl bg-[#F7F3ED]">
                        <JobIcon type={cat.iconType} />
                      </div>
                      <h5 className="text-[#4b433a] font-bold text-lg mb-2">{cat.title}</h5>
                      <p className="text-[#9A9084] text-sm">{cat.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                /* 강점/방향 탭일 때의 심플한 비주얼 */
                <div className="flex justify-center items-center py-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#8FA197] blur-3xl opacity-10 rounded-full"></div>
                    <svg className="relative w-16 h-16 text-[#8FA197] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* 해석 박스 (대시 보더 디자인) */}
            <div className="rounded-[2.5rem] border-2 border-dashed border-[#DED4C7] p-8 relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">
                  {activeCareerTab === "features" ? "✨" : activeCareerTab === "direction" ? "🎯" : "💼"}
                </span>
                <h4 className="text-lg font-bold text-[#4b433a]">
                  {activeCareerTab === "features"
                    ? "나의 커리어 강점"
                    : activeCareerTab === "direction"
                    ? "성장 포인트"
                    : "추천 직무"}
                </h4>
              </div>
              <p className="text-[#5E564C] leading-relaxed text-base sm:text-lg">
                {activeCareerTab === "features"
                  ? data.careerDetail?.features || data.career || "-"
                  : activeCareerTab === "direction"
                  ? data.careerDetail?.direction || "-"
                  : data.careerDetail?.recommendedJobs || "-"}
              </p>
            </div>
          </div>

          {/* 연애 성향 박스 */}
          <div className="rounded-3xl border border-[#E6D9CB] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#E29BA8]">💗</span>
              <h3 className="text-lg font-semibold text-[#4b433a]">연애</h3>
            </div>
            <div className="mt-2 space-y-4 text-sm sm:text-base text-[#5E564C] leading-relaxed">
              <div className="rounded-2xl border border-[#F3D6DC] bg-[#FFF7F9] px-4 py-3">
                <p className="text-xs font-semibold text-[#C27A8A] mb-1">나의 연애</p>
                <p>{loveDetail?.style || "-"}</p>
              </div>
              <div className="rounded-2xl border border-[#F3D6DC] bg-[#FFF7F9] px-4 py-3">
                <p className="text-xs font-semibold text-[#C27A8A] mb-1">이런 사람을 원해요</p>
                <p>{loveDetail?.needs || "-"}</p>
              </div>
            </div>
          </div>

          {/* 배우자 - 리뉴얼 디자인 (이미지 | 내용 가로 배치) */}
          <div className="rounded-[2.5rem] border border-[#E6D9CB] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* 제목 영역 */}
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#E29BA8]">💕</span>
                <h3 className="text-lg font-semibold text-[#4b433a]">미래의 배우자</h3>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-stretch">
              {/* 이미지 영역 */}
              <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                <img
                  src={gender === "M" ? "/FSW.png" : "/FSM.png"}
                  alt="미래의 배우자"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 콘텐츠 영역 */}
              <div className="md:w-3/5 p-8 space-y-8 flex flex-col justify-center">
                {/* 성향 정보 */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#F7F3ED] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#8FA197]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-[#4b433a] leading-tight">
                      {spouseData?.traits || data.spouse || "-"}
                    </h4>
                    <p className="text-[#9A9084] text-sm font-medium">
                      {spouseData?.traitsLabel || "배우자의 핵심 성향"}
                    </p>
                  </div>
                </div>

                {/* 포인트 정보 */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#F7F3ED] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#8FA197]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 11H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-[#4b433a] leading-tight">
                      {spouseData?.points || "-"}
                    </h4>
                    <p className="text-[#9A9084] text-sm font-medium">
                      {spouseData?.pointsLabel || "관계 안정을 위한 포인트"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 전체 요약 */}
          <div className="rounded-3xl border border-[#E6D9CB] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#4b433a]">전체 요약</h3>
            </div>
            <p className="mt-4 text-[#5E564C] leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {data.overallSummary || [data.wealth, data.health].filter(Boolean).join(" ") || "-"}
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full border border-[#D8D3C8] bg-white px-5 py-2.5 text-sm text-[#6B6258] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span className="font-semibold">다시 보기</span>
              <span className="text-[#B6ABA0]">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

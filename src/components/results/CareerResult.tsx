// src/components/results/CareerResult.tsx
// 진로 직업 찾기 결과 컴포넌트

import React from "react";

interface CareerResultData {
  name: string;
  energyType: string; // 수식어 (예: "넓은 대지")
  energyDescription: string;
  keywords: string[];
  imageUrl?: string; // 에너지 타입 이미지 URL
  energyOhaeng?: "木" | "火" | "土" | "金" | "水"; // 천간(오행) 색상용
  jobCategories: {
    title: string;
    professions: string;
    icon: string;
  }[];
  successTip: string;
  jobSatisfaction: number;
  suitabilityData: {
    category: string;
    characteristics: string;
    suitability: number;
  }[];
}

interface CareerResultProps {
  result: CareerResultData;
  onReset: () => void;
}

// 레이더 차트 컴포넌트
const RadarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const padding = 44;
  const size = 200 + padding * 2;
  const center = size / 2;
  const radius = 80;
  const numPoints = data.length;
  const angleStep = (2 * Math.PI) / numPoints;

  // 각 점의 좌표 계산
  const points = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2; // 시작점을 위로
    const valueRadius = (radius * item.value) / 100;
    const x = center + valueRadius * Math.cos(angle);
    const y = center + valueRadius * Math.sin(angle);
    return { x, y, label: item.label, value: item.value };
  });

  // 레이더 차트 영역을 그리기 위한 path 생성
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ") + " Z";

  // 그리드 라인
  const gridLines = [25, 50, 75, 100].map((level) => {
    const levelRadius = (radius * level) / 100;
    return (
      <circle
        key={level}
        cx={center}
        cy={center}
        r={levelRadius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  });

  // 축 라인
  const axes = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={x2}
        y2={y2}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  });

  // 레이블: 패딩 안에 들어가도록 labelRadius 조정, 한 줄로 표기
  const labelRadius = radius + 24;
  const labels = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return (
      <text
        key={index}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-gray-700 font-medium"
        style={{ fontSize: 11 }}
      >
        {item.label}
      </text>
    );
  });

  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`0 0 ${size} ${size}`}
      className="max-w-[280px] mx-auto"
      style={{ minHeight: 288 }}
    >
      {gridLines}
      {axes}
      <path
        d={pathData}
        fill="rgba(180, 83, 9, 0.2)"
        stroke="rgb(180, 83, 9)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="rgb(180, 83, 9)"
        />
      ))}
      {labels}
    </svg>
  );
};

// 바 차트 아이템 컴포넌트
const BarChartItem = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-800 font-bold">{value}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const JobCategoryIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "education":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M22 10L12 5L2 10L12 15L22 10Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 12V17C6 17 9 19 12 19C15 19 18 17 18 17V12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "art":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "startup":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "professional":
      return (
        <svg
          className="w-10 h-10 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 2L15 21L12 17L9 21L12 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 13H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <span className="text-2xl">💼</span>;
  }
};

export const CareerResult: React.FC<CareerResultProps> = ({ result, onReset }) => {
  const ohaengTextColor: Record<string, string> = {
    木: "text-green-600",
    火: "text-red-600",
    土: "text-yellow-600",
    金: "text-gray-600",
    水: "text-blue-600",
  };
  const energyColorClass = result.energyOhaeng
    ? ohaengTextColor[result.energyOhaeng] || "text-gray-800"
    : "text-gray-800";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* 1. 타고난 기운 섹션 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center border-4 border-green-200 overflow-hidden">
              {result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt={result.energyType}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
              {result.name}님의 기운
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              {result.name}님의 타고난 기운은{" "}
              <span className={`font-extrabold tracking-tight ${energyColorClass}`}>
                {result.energyType}
              </span>
              입니다
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              {result.energyDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 통합 적성 지표 섹션 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {result.name}님의 통합 적성 지표
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* 왼쪽: 5원소 밸런스 지수 (레이더 차트) */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              오행(五行)
            </h4>
            <div className="flex justify-center items-center">
              <RadarChart
                data={[
                  { label: "木 (성장)", value: 85 },
                  { label: "火 (발산)", value: 78 },
                  { label: "土 (안정)", value: 65 },
                  { label: "金 (결실)", value: 45 },
                  { label: "水 (지혜)", value: 52 },
                ]}
              />
            </div>
          </div>

          {/* 오른쪽: 직무 역량 지표 (바 차트) */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              직무 역량 지표 (CAREER DNA)
            </h4>
            <div className="space-y-4">
              <BarChartItem label="추진력 & 리더십" value={95} />
              <BarChartItem label="창의성 & 아이디어" value={88} />
              <BarChartItem label="관리 & 데이터 분석" value={42} />
              <BarChartItem label="소통 & 중개능력" value={79} />
            </div>
          </div>
        </div>

        {/* 요약 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="text-sm text-amber-700 mb-2">성공 적합도</div>
            <div className="text-4xl font-bold text-amber-800">92%</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="text-sm text-blue-700 mb-2">핵심 속성</div>
            <div className="text-xl font-bold text-blue-800">벽갑인화 (나무와 불)</div>
          </div>
        </div>

        {/* 분석 소견 및 추가 정보 */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h5 className="text-base font-bold text-gray-800 mb-3">분석 소견</h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              당신의 명조는 木, 火의 기운이 조화롭게 흐르고 있습니다. 이는 새로운 가치를 창조하고 외부에 널리 알리는 '전략적 메신저'의 자질이 매우 높음을 의미합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">BEST WORK STYLE</div>
              <div className="text-base font-semibold text-gray-800">자유로운 창작 환경</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">LUCK TIMING</div>
              <div className="text-base font-semibold text-gray-800">2026년 하반기</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 추천 직업 분야 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">⭐</span>
          <h3 className="text-xl font-bold text-gray-800">추천 직업 분야</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.jobCategories.map((category, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <JobCategoryIcon type={category.icon} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {category.title}
                  </h4>
                  <p className="text-sm text-gray-600">{category.professions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 성공을 위한 조언 */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xl">💡</span>
          </div>
          <h3 className="text-xl font-bold">성공을 위한 조언</h3>
        </div>
        <p className="text-white/90 text-base leading-relaxed mb-6">
          {result.successTip}
        </p>
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">직무 만족도 예상</span>
            <span className="text-lg font-bold">{result.jobSatisfaction}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${result.jobSatisfaction}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. 운세 데이터 기반 직무 적합성 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <svg
            className="w-6 h-6 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M7 16l4-4 4 4 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-800">
            운세 데이터 기반 직무 적합성
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  오행 분류
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  대표 특성
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  적합 지수
                </th>
              </tr>
            </thead>
            <tbody>
              {result.suitabilityData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.characteristics}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-gray-800">
                    {item.suitability}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
          <p>본 분석은 사주 오행과 십신 이론을 바탕으로 한 시뮬레이션입니다.</p>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
          >
            <span>다시 분석하기</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M20.49 9A9 9 0 003.51 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.51 9A9 9 0 0020.49 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


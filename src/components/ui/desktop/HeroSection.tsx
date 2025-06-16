// src/components/ui/desktop/HeroSection.tsx

// 이 컴포넌트는 홈페이지의 첫인상을 결정하는 히어로 섹션이다.
// 어떤 텍스트와 버튼이 들어갈지는 외부(props)에서 주입받는다.

import { Button } from "../common/Button"; // 우리가 만든 공용 버튼을 가져온다.

interface HeroSectionProps {
  title: string;
  buttonText: string;
  imageUrl: string;
}

export const HeroSection = ({
  title,
  buttonText,
  imageUrl,
}: HeroSectionProps) => {
  return (
    // 모바일에서는 높이를 줄이고(h-[320px]), 데스크톱(lg)에서는 높이를 늘린다(lg:h-[400px]).
    <section className="relative w-full h-[320px] lg:h-[400px] rounded-2xl overflow-hidden">
      {/* 배경 이미지는 그대로 유지 */}
      <img
        src={imageUrl}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 콘텐츠 영역의 패딩과 텍스트 크기를 화면 크기에 따라 조절한다. */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full p-6 lg:p-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-text-light max-w-lg leading-tight lg:leading-tight [text-shadow:0px_2px_8px_#00000080]">
          {title}
        </h1>

        {/* 버튼도 모바일에서는 기본 사이즈, 데스크톱에서는 크게 만든다. */}
        <Button size="default" className="mt-6 lg:size-lg">
          {buttonText}
        </Button>
      </div>
    </section>
  );
};

import { ContentCard, type ContentCardProps } from "./ContentCard";

// 이 그리드가 어떤 데이터를 받아야 하는지 정의
interface ContentGridProps {
  items: ContentCardProps[]; // 카드 데이터의 '배열'
}

export const ContentGrid = ({ items }: ContentGridProps) => {
  return (
    // grid: 그리드 레이아웃을 사용
    // grid-cols-1: 기본(모바일)에서는 1줄
    // md:grid-cols-2: md 사이즈 이상에서는 2줄
    // xl:grid-cols-3: xl 사이즈 이상에서는 3줄로 자동 변경
    // gap-8: 아이템 간의 간격
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
      {items.map((item, index) => (
        <ContentCard key={index} {...item} />
      ))}
    </div>
  );
};

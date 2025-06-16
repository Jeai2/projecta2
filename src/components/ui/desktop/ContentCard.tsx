import { Eye, Heart } from "lucide-react";
// 우리가 만든 '조립식 식기 세트'를 모두 가져온다.
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../common/Card";

// 이 카드가 받아야 할 정보의 타입 (변화 없음)
export interface ContentCardProps {
  imageUrl: string;
  title: string;
  description: string;
  views: string;
  likes: string;
}

export const ContentCard = ({
  imageUrl,
  title,
  description,
  views,
  likes,
}: ContentCardProps) => {
  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-accent-gold transition-all duration-300 cursor-pointer">
      <CardHeader className="p-0">
        <div className="overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            // 모바일에서는 이미지를 약간 작게(h-40), 데스크톱에서는 크게(lg:h-48)
            className="w-full h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 lg:p-6 pb-2">
          {/* 모바일에서는 h2-m, 데스크톱에서는 더 큰 h1-xl을 쓸 수도 있다 (예시) */}
          <CardTitle className="text-h2-m text-text-light">{title}</CardTitle>
        </div>
      </CardHeader>

      {/* 모바일에서는 본문 높이를 줄여서 더 간결하게 보이도록 한다. */}
      <CardContent className="px-4 lg:px-6 h-20 lg:h-24 overflow-hidden">
        <p className="text-body-md text-text-muted">{description}</p>
      </CardContent>

      <CardFooter className="px-4 lg:px-6 justify-start gap-4 lg:gap-6 text-text-subtle text-sm">
        <div className="flex items-center gap-2">
          <Eye size={16} />
          <span>{views}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={16} />
          <span>{likes}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

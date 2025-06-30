import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { SinsalSummaryCard } from "@/components/results/common/SinsalSummaryCard";
import { SinsalDetailModal } from "@/components/results/common/StarDetailModal";
import type { StarData } from "@/types/fortune"; // SinsalData 타입을 fortune.d.ts에서 관리한다고 가정

// ✅ [추가] 이 컴포넌트가 받을 props 타입 정의
interface StarSectionProps {
  title: string;
  description: string;
  data: StarData[];
  noDataMessage: string;
}

export const StarSection: React.FC<StarSectionProps> = ({
  title,
  description,
  data,
  noDataMessage,
}) => {
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{noDataMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((star) => (
            <SinsalSummaryCard
              key={star.name}
              data={star}
              onClick={() => setSelectedStar(star)}
              layoutId={`star-card-${star.name}`}
            />
          ))}
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedStar && (
          <SinsalDetailModal
            sinsal={selectedStar} // prop 이름은 SinsalDetailModal 내부에서 사용하는 이름
            onClose={() => setSelectedStar(null)}
            layoutId={`star-card-${selectedStar.name}`}
          />
        )}
      </AnimatePresence>
    </>
  );
};

import { SajuPillar } from "@/components/results/common/SajuPillar"; // 추가
import { useFortuneStore } from "@/store/fortuneStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/common/Accordion";
import { AlertCircle } from "lucide-react";
import { titleToKey } from "@/lib/utils";

export const DayMasterSection = () => {
  const { fortuneResult } = useFortuneStore();

  if (!fortuneResult?.saju?.sajuData || !fortuneResult.saju?.interpretation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>4. 일간 해석 (나의 본질)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-text-muted h-64">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p>해석 정보를 표시할 수 없습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { sajuData, interpretation } = fortuneResult.saju;
  const { pillars } = sajuData;

  return (
    <Card className="animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          4. 일간 해석 (나의 본질)
        </CardTitle>
        <CardDescription>
          당신을 상징하는 핵심 기운, 일주({sajuData.pillars.day.gan})을 중심으로
          당신의 성향과 에너지를 분석합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-2 text-center">
          {["시주", "일주", "월주", "년주"].map((title) => (
            <SajuPillar
              key={title}
              title={title}
              data={pillars[titleToKey(title)]}
              isHighlighted={title === "일주"}
              shouldDimOthers
            />
          ))}
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="dayMaster"
        >
          <AccordionItem value="dayMaster">
            <AccordionTrigger>
              일간({sajuData.pillars.day.gan})으로 보는 나의 성격
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-base leading-relaxed whitespace-pre-wrap">
              <p>{interpretation.dayMasterNature.base}</p>
              {interpretation.dayMasterNature.custom && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-accent-gold mb-2">
                    심층 분석
                  </p>
                  <p>{interpretation.dayMasterNature.custom}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

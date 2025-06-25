// src/components/results/sections/ForewordSection.tsx (심화 버전)

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/common/Card";
import { Button } from "@/components/ui/common/Button";
import { Mail, X } from "lucide-react";
import { StarryBackground } from "@/components/effects/StarryBackground";

export const ForewordSection = () => {
  // ✅ 개인 편지 팝업(모달)의 열림/닫힘 상태를 관리합니다.
  const [isPersonalLetterOpen, setIsPersonalLetterOpen] = useState(false);

  return (
    // ✅ 1. 부모 컨테이너에 relative 클래스를 추가하여 배경 컴포넌트의 기준점으로 만듭니다.
    <section className="relative overflow-hidden rounded-lg">
      {/* ✅ 2. StarryBackground 컴포넌트를 배경으로 삽입합니다. */}
      <StarryBackground />

      {/* ✅ 3. 기존 카드에 z-10 클래스를 추가하여 배경 위에 위치하도록 합니다. */}
      <Card className="relative z-10 bg-background-main/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>사주란 무엇인가</CardTitle>
          <CardDescription>삶을 이해하기 위한 하나의 방식</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap leading-relaxed text-text-muted text-base">
            {`사람은 누구나 스스로 선택하지 않은 시간과 장소에서 이 세상에 태어납니다. 어떤 이름으로 불릴지, 어떤 가정에서 자랄지, 어떤 슬픔과 기쁨을 만나게 될지 알지 못한 채로, 조용히 삶은 시작되지요.

사주는 그 태어난 순간, 당신의 시간과 공간이 만나 남긴 하나의 흐름이자 인연의 지문입니다. 그것은 어떤 판단이나 평가와는 관계없이, 당신이 이 세상에 놓인 자리에서 자연스럽게 그어진 하나의 선과도 같은 것입니다.

어떤 사람은 그것을 ‘점’이라 부르고, 또 어떤 사람은 ‘학문’이라 여깁니다. 누군가는 호기심으로, 누군가는 마음의 무게를 안고 찾아오기도 합니다. 그러나 그 다양한 시선 안에서 결국 우리 모두가 품고 있는 마음은 하나일지 모릅니다. 나를 조금 더 알고 싶다는 마음, 지금 걸어가고 있는 이 길이 괜찮은지 조심스레 되묻고 싶은 마음.

사주는 단정하지 않습니다. 다만 지금 당신이 마주하고 있는 삶의 결들을 조금 다르게 비춰주는 거울이 되어줍니다. 때로는 힘든 날들을 함께 돌아보며 그 시간을 지나온 당신의 마음을 조용히 쓰다듬고, 때로는 그 모든 겪음이 피할 수 없는 운명이 아니라, 당신이 걸어낸 하나의 의미였음을 가만히 일러줍니다.

사주는 잊고 있던 내면의 목소리와 다시 마주하게 하고, 내가 누구인지, 어디로 흘러가고 있는지, 무엇을 받아들이고 무엇은 놓아도 괜찮은지를 다정하게 이야기해 줍니다.

그것은 미래를 예언하는 도구가 아니라, 삶을 이해하기 위해 내 앞에 펼쳐진 언어이자 구조입니다. 점이라 부르든, 학문이라 여기든, 혹은 마음에 담는 이야기로 느끼든. 중요한 건, 그 안에서 당신이 조금 더 나를 받아들이게 되는 순간이 있다는 사실입니다.

그리고 그렇게, 오늘 하루를 조금 더 나답게, 조금 더 단단하게 살아낼 수 있다면, 그걸로 사주는 이미 당신 곁에 충분히 머물러 있었던 셈입니다.`}
          </p>
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              className="text-accent-gold hover:text-accent-gold hover:bg-accent-gold/10"
              onClick={() => setIsPersonalLetterOpen(true)}
            >
              <Mail className="w-4 h-4 mr-2" />
              방재이가 전하는 편지
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPersonalLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-in fade-in-50">
          {/* ✅ 4. 편지지 디자인 개선: 한지 텍스처와 그림자 효과 적용 */}
          <div
            className="relative w-[90%] max-w-lg h-[80vh] bg-cover bg-center rounded-sm shadow-2xl flex flex-col"
            style={{ backgroundImage: "url(/hanji_3.gif)" }} // 한지 텍스처 이미지 적용
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 text-stone-600 hover:text-stone-900"
              onClick={() => setIsPersonalLetterOpen(false)}
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="w-full h-4 bg-stone-800/80 rounded-t-sm flex-shrink-0 shadow-inner"></div>
            <div className="px-10 py-8 overflow-y-auto">
              <h3 className="text-2xl font-bold text-center mb-6 font-sans text-stone-900">
                들어가기에 앞서
              </h3>
              <p className="whitespace-pre-wrap leading-loose text-stone-800 text-base font-sans">
                {`당신의 여정에서 앞으로의 통변이 소중한 지표가 될지 
모릅니다. 하지만 그것이 전부가 아니라는 것을 알아주
셨으면 합니다.

인생의 길을 걸으며 ‘나를 알아가는 과정’은 내면의 목소리에 귀 기울이는 것이 중요합니다. 우리 각자의 삶은 유일무이한 이야기를 담고 있고, 제가 해드리는 통변은 그저 도구 중 하나일 뿐입니다. 이 지혜를 활용하여 자신의 길을 더 넓은 시야로 바라보되, 그 선택은 항상 당신의 손에 있음을 잊지 마세요.

정해진 미래가 아닌 수많은 미래 앞에 당신의 선택으로 결말을 만들어 나아가고, 시간의 실로 당신의 이야기를 직조하여 탐색하는 여정에서 분명 당신은 진정한 ‘나’를 발견하게 될 것입니다.
`}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

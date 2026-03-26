// src/components/results/v2/sections/ForewordV2.tsx

import { useState } from "react";
import { SectionFrame } from "../SectionFrame";
import { Mail, ChevronDown, ChevronUp } from "lucide-react";

const FOREWORD_TEXT = `사주팔자는 사람이 태어난 년(年), 월(月), 일(日), 시(時)의 네 가지 기둥(柱)과, 각 기둥에 배치된 여덟 개의 천간(天干)·지지(地支) 글자를 의미합니다. 사람은 누구나 스스로 선택하지 않은 시간과 장소에서 이 세상에 태어납니다. 어떤 이름으로 불릴지, 어떤 가정에서 자랄지, 살아가며 어떤 슬픔과 기쁨을 만나게 될지 알지 못한 채로 삶은 조용히 시작됩니다.

사주(四柱)란 바로 그 탄생의 순간, 당신이라는 존재가 시간과 공간을 만나 남긴 하나의 흐름이자 '지문'입니다. 그것은 어떤 판단이나 평가와는 상관없이, 당신이 이 세상에 놓인 자리에서 자연스럽게 그어진 하나의 선(線)과도 같습니다.

누군가는 이를 '점'이라 부르고, 또 누군가는 '학문'이라 여깁니다. 호기심에 이끌려 오기도 하고, 때로는 감당하기 어려운 마음의 무게를 안고 찾아오기도 합니다. 하지만 그 다양한 시선 안에서 결국 우리가 품고 있는 마음은 하나일지 모르죠. '나를 조금 더 알고 싶다는 마음', 그리고 '지금 걸어가고 있는 이 길이 괜찮은지' 조심스레 되묻고 싶은 마음 말입니다.

화의명리(和意命理)가 지향하는 사주는 결코 삶을 단정하지 않습니다. 다만, 지금 당신이 마주하고 있는 삶의 결들을 조금 다른 각도에서 비춰주는 '거울'이 되어드리고자 합니다. 때로는 힘든 날들을 함께 돌아보며 그 시간을 지나온 당신의 마음을 조용히 쓰다듬고, 그 모든 겪음이 피할 수 없는 운명이 아니라 당신이 꿋꿋하게 걸어낸 하나의 의미였음을 가만히 일러줍니다.
`;

const LETTER_TEXT = `인생이란 책... 우리는 삶의 어느 페이지를 펼쳐도, 각자마다 끝이 보이지 않는 터널 같은 계절이 있습니다. 지금 이 글을 읽고 있는 본인도, 어쩌면 아무에게도 말 못 한 무게를 혼자 들고 있을지 모르죠.

변화는 무너짐이 아닙니다. 낡은 것이 떠나가고 새로운 것이 들어오는 그 경계에서, 우리는 누구나 한 번쯤 흔들립니다. 그 흔들림이 너무 오래 계속되면, 자기 자신이 문제인 것처럼 느껴지기도 하죠. 하지만 저는 알고 있습니다. 흔들린다는 것은, 아직 포기하지 않았다는 증거인 것을요.

완성된 모습만이 본인인 것은 아닙니다. 웃다가 울고, 다짐하다가 주저앉고, 다시 또 일어서려 애쓰는 그 모든 투박하고 서툰 날들이 고스란히 당시닝라는 사람입니다.

이 기록들이 본인의 삶을 단번에 바꿔놓지는 못할 것입니다. 다만, 스스로를 가장 몰아세우고 싶은 그 순간에 "지금의 나도 괜찮다"고 조용히 말해줄 수 있는 작은 손이 되고 싶습니다.

비를 맞는 것을 너무 두려워하지 마세요. 비가 그친 자리의 땅은 언제나 이전보다 조금 더 단단해지니까요.
당신이 지나고 있는 이 계절의 끝에, 스스로를 조금 더 따뜻하게 안아줄 수 있는 하루가 반드시 오기를... 

그것을 조용히, 그러나 간절히 바랍니다.`;

export const ForewordV2 = () => {
  const [letterOpen, setLetterOpen] = useState(false);

  return (
    <SectionFrame
      chapterNum={1}
      title="서문"
      description="삶을 이해하기 위한 하나의 방식"
    >
      <p className="whitespace-pre-wrap leading-[1.9] text-text-muted text-[15px]">
        {FOREWORD_TEXT}
      </p>

      {/* 방재이 편지 — 인라인 확장 */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={() => setLetterOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-accent-gold hover:text-accent-gold/75 transition"
        >
          <Mail className="w-4 h-4" />
          화의(和義) 방재이가 전하는 편지
          {letterOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {letterOpen && (
          <div className="mt-4 p-5 sm:p-6 bg-background-sub rounded-xl">
            <p className="text-sm leading-[1.8] text-stone-600 whitespace-pre-wrap antialiased">
              {LETTER_TEXT}
            </p>
          </div>
        )}
      </div>
    </SectionFrame>
  );
};

// src/pages/FortuneCookiePage.tsx
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";

const FORTUNES = [
  "오늘은 멈추지 말고 한 발짝만 더 나아가 보세요.",
  "작은 친절이 누군가의 하루를 바꿀 수 있습니다.",
  "지금 고민하는 일, 6개월 후엔 웃으며 이야기할 거예요.",
  "당신의 직감은 생각보다 훨씬 정확합니다.",
  "놓친 것보다 아직 남아 있는 것에 집중해 보세요.",
  "오늘 하루, 스스로에게 너그러워져도 괜찮습니다.",
  "인연은 억지로 잡는 게 아니라 자연스럽게 남는 것입니다.",
  "지금 서 있는 자리가 나중엔 의미 있는 출발점이 됩니다.",
  "완벽하지 않아도 됩니다. 시작하는 것만으로도 충분합니다.",
  "두드리는 만큼 열립니다. 오늘 한 번 더 두드려 보세요.",
  "걱정보다 행동이 항상 빠릅니다.",
  "소중한 사람에게 오늘 연락해 보세요.",
  "휴식도 성장의 일부입니다. 지금 잠시 쉬어도 됩니다.",
  "예상치 못한 곳에서 좋은 소식이 들어올 수 있습니다.",
  "오늘의 작은 결정이 내일을 바꿉니다.",
  "내가 뿌린 씨앗은 반드시 어디선가 싹을 틔웁니다.",
  "당신이 생각하는 것보다 당신은 훨씬 잘하고 있습니다.",
  "기다리는 일이 있다면, 조금만 더 기다려 보세요.",
  "마음이 가는 쪽이 맞는 방향입니다.",
  "오늘 마주치는 낯선 인연이 귀한 縁이 될 수 있습니다.",
  "너무 멀리 보지 말고, 오늘 딱 하루만 생각해 보세요.",
  "비어 있는 것처럼 보여도, 이미 채워지고 있습니다.",
  "용기를 내는 것, 그 자체가 이미 절반의 성공입니다.",
  "지금의 어려움은 더 단단해지기 위한 과정입니다.",
  "오늘 하루 좋은 일이 생길 예감이 납니다.",
  "필요한 것은 이미 당신 곁에 있을지도 모릅니다.",
  "남들의 속도와 비교하지 마세요. 당신의 때가 있습니다.",
  "잃어버린 게 아니라, 더 나은 것을 위한 공간이 생긴 겁니다.",
  "오늘 한 가지, 미뤄뒀던 일을 해보는 건 어떨까요?",
  "당신의 웃음이 주변 사람들에게 에너지가 됩니다.",
  "모든 것은 때가 되면 자리를 잡습니다. 서두르지 않아도 됩니다.",
  "오늘의 작은 감사가 내일의 큰 행복을 부릅니다.",
  "실패한 게 아닙니다. 방법을 하나 더 알게 된 겁니다.",
  "기대하지 않았던 곳에서 기쁨이 찾아올 거예요.",
  "지금 느끼는 감정은 충분히 자연스럽습니다.",
  "새로운 시도가 새로운 나를 만듭니다.",
  "오늘 한 번은 나 자신을 위한 시간을 내보세요.",
  "가장 먼 길도 첫걸음에서 시작됩니다.",
  "당신의 존재 자체가 누군가에게는 위안입니다.",
  "좋은 에너지는 반드시 돌아옵니다.",
  // --- 추가된 10개의 문장 ---
  "지금 이 순간에도 당신은 충분히 소중합니다.",
  "변화는 작은 결심에서 시작됩니다.",
  "오늘 고마웠던 한 가지를 적어보세요.",
  "하루의 끝에 자신에게 따뜻한 말을 건네주세요.",
  "내일의 태양도 당신을 기다리고 있습니다.",
  "조급함보다는 천천히 나아감이 때로는 더 멀리 갑니다.",
  "무엇이든 시작할 수 있는 힘이 오늘 안에 있습니다.",
  "오늘 받은 친절을 또 다른 누군가에게 나눠보세요.",
  "불확실한 모든 길이 결국은 나를 위한 방향이 됩니다.",
  "나만의 속도로 걸어가도 괜찮습니다.",
  "오늘의 고민이 내일은 미소로 남을 거예요.",
  "내 마음을 소중히 여기는 하루가 되길 바랍니다.",
  "잠깐의 멈춤이 앞으로 나아갈 힘이 됩니다.",
  "이 순간, 있는 그대로의 당신을 응원합니다.",
  "작은 시도도 언젠가는 큰 변화를 만듭니다.",
  "힘들 땐 숨을 깊이 쉬어도 괜찮아요.",
  "오늘의 선택이 내일을 밝혀줄 거예요.",
  "고요한 시간 속에서 자신을 발견할 수 있습니다.",
  "흐린 날도 곧 맑은 하늘로 바뀝니다.",
  "주변을 둘러보면 어느새 봄기운이 스며와 있습니다.",
];

type Phase = "idle" | "cracking" | "open";

const FortuneCookiePage = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fortune, setFortune] = useState("");

  const crack = () => {
    if (phase !== "idle") return;
    setPhase("cracking");
    setTimeout(() => {
      const idx = Math.floor(Math.random() * FORTUNES.length);
      setFortune(FORTUNES[idx]);
      setPhase("open");
    }, 700);
  };

  const reset = () => {
    setPhase("idle");
    setFortune("");
  };

  return (
    <FortunePageLayout
      title="포춘쿠키"
      description="오늘의 한 마디를 쿠키에 담아드릴게요"
      contentWrapperClassName="p-0 bg-transparent"
    >
      <div className="flex flex-col items-center justify-center min-h-[55vh] px-4 py-10 gap-8">
        {phase === "open" ? (
          <div
            className="flex flex-col items-center gap-6"
            style={{ animation: "fadeInUp 0.5s ease both" }}
          >
            <div className="text-7xl">🥠</div>
            <div className="max-w-xs w-full bg-white rounded-2xl border border-orange-100 shadow-md px-7 py-6 text-center">
              <p className="text-base font-medium text-gray-800 leading-relaxed">
                &ldquo;{fortune}&rdquo;
              </p>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors"
            >
              <RefreshCw size={13} />
              다시 뽑기
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={crack}
              disabled={phase === "cracking"}
              aria-label="쿠키 열기"
              className={`text-8xl leading-none select-none transition-transform duration-300 focus:outline-none ${
                phase === "cracking"
                  ? "scale-125 opacity-60"
                  : "hover:scale-110 active:scale-95 cursor-pointer"
              }`}
              style={
                phase === "cracking"
                  ? { animation: "cookieCrack 0.6s ease both" }
                  : undefined
              }
            >
              🥠
            </button>
            <p className="text-sm text-gray-400 transition-opacity">
              {phase === "cracking" ? "쿠키를 열고 있어요..." : "쿠키를 눌러 오늘의 운을 확인하세요"}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cookieCrack {
          0%   { transform: scale(1) rotate(0deg); }
          25%  { transform: scale(1.15) rotate(-8deg); }
          50%  { transform: scale(1.2) rotate(8deg); }
          75%  { transform: scale(1.1) rotate(-4deg); }
          100% { transform: scale(1.25) rotate(0deg); opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </FortunePageLayout>
  );
};

export default FortuneCookiePage;

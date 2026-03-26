// src/pages/YutJeomPage.tsx
// 윷점 — 윷 4개를 3번 던져 각 결과의 2비트로 6효를 완성, 주역 64괘를 뽑는 페이지
// 1번째: 1·2효 / 2번째: 3·4효 / 3번째: 5·6효
// 키 = throw[2].bigram + throw[1].bigram + throw[0].bigram (line6..line1, 위→아래)

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { FortunePageLayout } from "@/components/layout/FortunePageLayout";
import { guaYutInterpretations, type IchingYutInterpretation } from "../../server/src/data/iching/hexagrams";

// ─── Types ────────────────────────────────────────────────────────────────────

type YutName = "도" | "개" | "걸" | "윷" | "모";
type Bigram = "11" | "10" | "01" | "00";
type TaeName = "태양" | "소양" | "소음" | "태음";

interface ThrowResult {
  yutName: YutName;
  bigram: Bigram;
  stickFaces: boolean[]; // true = 배(평면)
  taeName: TaeName;
}

// ─── 64괘 이름 (키 = line6 line5 line4 line3 line2 line1, 위→아래) ──────────
// ─── 윷 결과 매핑 ─────────────────────────────────────────────────────────────

const BIGRAM_DATA: Record<number, { yutName: YutName; bigram: Bigram; taeName: TaeName }> = {
  0: { yutName: "모", bigram: "00", taeName: "태음" },
  1: { yutName: "도", bigram: "11", taeName: "태양" },
  2: { yutName: "개", bigram: "10", taeName: "소양" },
  3: { yutName: "걸", bigram: "01", taeName: "소음" },
  4: { yutName: "윷", bigram: "00", taeName: "태음" },
};

function rollYut(): ThrowResult {
  const stickFaces = Array.from({ length: 4 }, () => Math.random() < 0.5);
  const flatCount = stickFaces.filter(Boolean).length;
  const { yutName, bigram, taeName } = BIGRAM_DATA[flatCount];
  return { yutName, bigram, taeName, stickFaces };
}

/**
 * 6비트 키 생성
 * throws[0]=1·2효(하단), throws[1]=3·4효(중단), throws[2]=5·6효(상단)
 * 각 bigram: bigram[0]=위 효, bigram[1]=아래 효
 * 키(위→아래) = throws[2].bigram + throws[1].bigram + throws[0].bigram
 */
function getHexagramKey(throws: ThrowResult[]): string {
  return [...throws].reverse().map((t) => t.bigram).join("");
}

// ─── YutStick ────────────────────────────────────────────────────────────────

const YutStick = ({
  isFlat,
  isAnimating,
  idx,
}: {
  isFlat: boolean;
  isAnimating: boolean;
  idx: number;
}) => (
  <motion.div
    animate={
      isAnimating
        ? {
            y: [0, -(65 + idx * 8), -(88 + idx * 5), 0],
            rotate: [0, -15 + idx * 12, 160 + idx * 50, 360 + idx * 25],
          }
        : { y: 0, rotate: 0 }
    }
    transition={
      isAnimating
        ? { duration: 0.8, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }
        : { duration: 0 }
    }
  >
    <div
      className={`w-8 h-24 border transition-colors duration-300 ${
        isFlat
          ? "bg-amber-100 border-amber-300 rounded-lg shadow-inner"
          : "bg-amber-800 border-amber-900 rounded-full shadow-md"
      }`}
    />
  </motion.div>
);

// ─── 단일 효 라인 ─────────────────────────────────────────────────────────────

const HexSingleLine = ({ bit, isEmpty }: { bit: "0" | "1"; isEmpty: boolean }) => {
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-5">
        <div className="w-28 h-px border-t border-dashed border-gray-200" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center justify-center h-5 gap-1.5"
    >
      {bit === "1" ? (
        <div className="w-28 h-1.5 rounded-full bg-gray-700" />
      ) : (
        <>
          <div className="w-[50px] h-1.5 rounded-full bg-gray-700" />
          <div className="w-[50px] h-1.5 rounded-full bg-gray-700" />
        </>
      )}
    </motion.div>
  );
};

// 한 번의 던지기 = 2효 쌍
const HexPair = ({
  throw_,
  isNewest,
}: {
  throw_?: ThrowResult;
  isNewest: boolean;
}) => {
  const isEmpty = !throw_;
  // bigram[0] = 위 효, bigram[1] = 아래 효
  return (
    <div className={`flex flex-col gap-2 ${isNewest ? "opacity-100" : "opacity-90"}`}>
      <HexSingleLine bit={isEmpty ? "0" : (throw_.bigram[0] as "0" | "1")} isEmpty={isEmpty} />
      <HexSingleLine bit={isEmpty ? "0" : (throw_.bigram[1] as "0" | "1")} isEmpty={isEmpty} />
    </div>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

const TOTAL = 3;
type Phase = "intro" | "throwing" | "result";

const YutJeomPage = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [throws, setThrows] = useState<ThrowResult[]>([]);
  const [lastThrow, setLastThrow] = useState<ThrowResult | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (throws.length === TOTAL && phase === "throwing") {
      const t = setTimeout(() => setPhase("result"), 900);
      return () => clearTimeout(t);
    }
  }, [throws.length, phase]);

  const handleThrow = useCallback(() => {
    if (animating || throws.length >= TOTAL) return;
    const result = rollYut();
    setLastThrow(result);
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      setThrows((prev) => [...prev, result]);
    }, 900);
  }, [animating, throws.length]);

  const handleReset = () => {
    setPhase("intro");
    setThrows([]);
    setLastThrow(null);
    setAnimating(false);
  };

  // 결과 계산
  const hexKey = throws.length === TOTAL ? getHexagramKey(throws) : null;
  const interp: IchingYutInterpretation | null = hexKey ? guaYutInterpretations[hexKey] ?? null : null;

  // ── 인트로 ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <FortunePageLayout
        title="윷점"
        description="윷으로 점치기"
        contentWrapperClassName="p-0 bg-transparent"
      >
        <div className="flex flex-col items-center gap-8 py-10 px-4">
          <div className="text-6xl select-none">🪵</div>
          <p className="text-sm text-gray-500 leading-relaxed text-center max-w-xs">
            윷 4개를 3번 던져<br />
            자신의 운세를 알아보세요
          </p>
          <button
            onClick={() => setPhase("throwing")}
            className="px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 active:scale-95 transition-all"
          >
            시작하기
          </button>
        </div>
      </FortunePageLayout>
    );
  }

  // ── 던지기 / 결과 ────────────────────────────────────────────────────────────
  return (
    <FortunePageLayout
      title="윷점"
      description="윷을 던져 자신의 운세를 알아보세요"
      contentWrapperClassName="p-0 bg-transparent"
    >
      <div className="flex flex-col items-center gap-6 py-6 px-4">

        {/* 괘 시각화: flex-col-reverse → index 0(1·2효)=화면 아래, index 2(5·6효)=화면 위 */}
        <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-10 py-6 w-full max-w-xs">
          <p className="text-center text-xs text-gray-400 mb-5">
            {throws.length} / 3
          </p>
          <div className="flex flex-col-reverse gap-4">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <HexPair
                key={i}
                throw_={throws[i]}
                isNewest={i === throws.length - 1}
              />
            ))}
          </div>
        </div>

        {/* 던지기 영역 */}
        {phase === "throwing" && (
          <div className="flex flex-col items-center gap-5">
            {/* 윷 4개 애니메이션 */}
            <div className="flex gap-3 items-end h-28">
              {Array.from({ length: 4 }).map((_, i) => (
                <YutStick
                  key={i}
                  isFlat={lastThrow ? lastThrow.stickFaces[i] : false}
                  isAnimating={animating}
                  idx={i}
                />
              ))}
            </div>

            {/* 결과 레이블 */}
            {lastThrow && !animating && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <span className="text-3xl font-bold text-gray-800">{lastThrow.yutName}</span>
              </motion.div>
            )}

            {/* 던지기 버튼 */}
            <button
              onClick={handleThrow}
              disabled={animating || throws.length >= TOTAL}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all select-none ${
                animating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : throws.length >= TOTAL
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
              }`}
            >
              {animating
                ? "던지는 중..."
                : throws.length === 0
                ? "던지기"
                : throws.length === 1
                ? "한 번 더"
                : throws.length === 2
                ? "마지막!"
                : "완성!"}
            </button>
          </div>
        )}

        {/* 결과 해석 */}
        {phase === "result" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xs space-y-3"
          >
            {interp ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">{interp.해석}</p>
                <div className="space-y-3 pt-1">
                  {(
                    [
                      ["직장운", interp.직장운],
                      ["사업운", interp.사업운],
                      ["금전운", interp.금전운],
                      ["연애",   interp.연애],
                      ["건강",   interp.건강],
                    ] as [string, string][]
                  ).map(([label, val]) => (
                    <div key={label}>
                      <span className="text-xs font-semibold text-gray-400">{label}</span>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center text-sm text-gray-400">
                <p className="text-xs">해석 데이터 준비 중입니다</p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto pt-1"
            >
              <RefreshCw size={13} />
              다시 점치기
            </button>
          </motion.div>
        )}
      </div>
    </FortunePageLayout>
  );
};

export default YutJeomPage;

// server/src/services/iching.service.ts
// 시간 기반 테마(5종) → 에너지 삼중값(태양/소양/소음/태음) → 6비트 키 → 괘 조회

import { guaInterpretations } from "../data/iching/hexagrams";

const ENERGY_MAP = ["태양", "소양", "소음", "태음"] as const;
export type Energy = (typeof ENERGY_MAP)[number];
export type Triplet = [Energy, Energy, Energy];

export type TimeBandBias = {
  morning: number;
  day: number;
  evening: number;
  night: number;
};

const ENERGY_TO_BITS: Record<Energy, string> = {
  태양: "11",
  소양: "10",
  소음: "01",
  태음: "00",
};

function toHMS(date: Date) {
  return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() };
}
function mod4(n: number) {
  const r = n % 4;
  return r < 0 ? r + 4 : r;
}
function asEnergy(n0to3: number): Energy {
  return ENERGY_MAP[mod4(n0to3)];
}

function getBandKey(hh: number): keyof TimeBandBias {
  if (hh >= 5 && hh <= 10) return "morning";
  if (hh >= 11 && hh <= 16) return "day";
  if (hh >= 17 && hh <= 21) return "evening";
  return "night";
}

// 1) 기본(균형) — ModSum
export function calcModSum(date: Date): Triplet {
  const { h, m, s } = toHMS(date);
  const a = mod4(h + m);
  const b = mod4(h + s);
  const c = mod4(m + s);
  return [asEnergy(a), asEnergy(b), asEnergy(c)];
}

// 2) 시간감 강조 — TimeBand
export function calcTimeBand(date: Date, bias: TimeBandBias): Triplet {
  const { h, m, s } = toHMS(date);
  const baseA = mod4(h + m);
  const baseB = mod4(h + s);
  const baseC = mod4(m + s);
  const key = getBandKey(h);
  const delta = bias[key] ?? 0;
  const a = mod4(baseA + delta);
  const b = mod4(baseB + delta);
  const c = mod4(baseC + delta);
  return [asEnergy(a), asEnergy(b), asEnergy(c)];
}

// 3) 감성·연애 — Weighted Romantic
export function calcWeightedRomantic(date: Date): Triplet {
  const { h, m, s } = toHMS(date);
  const aFloat = h * 0.5 + m * 1.5;
  const bFloat = h * 0.3 + s * 1.7;
  const c = mod4(m + s);
  const a = mod4(Math.floor(aFloat));
  const b = mod4(Math.floor(bFloat));
  return [asEnergy(a), asEnergy(b), asEnergy(c)];
}

// 4) 의례·리추얼 — ParityRitual
export function calcParityRitual(date: Date): Triplet {
  const { h, m, s } = toHMS(date);
  const f = (x: number, y: number) => (x % 2 << 1) | y % 2;
  const a = f(h, m);
  const b = f(h, s);
  const c = f(m, s);
  return [asEnergy(a), asEnergy(b), asEnergy(c)];
}

// 5) 긴장·해결 — AbsDiffTension
export function calcAbsDiffTension(date: Date): Triplet {
  const { h, m, s } = toHMS(date);
  const a = mod4(Math.abs(h - m));
  const b = mod4(Math.abs(h - s));
  const c = mod4(Math.abs(m - s));
  return [asEnergy(a), asEnergy(b), asEnergy(c)];
}

// 에너지 삼중값 → 6비트 키(상:2비트, 중:2비트, 하:2비트)
export function energiesToHexagramKey(triplet: Triplet): string {
  const [a, b, c] = triplet;
  return `${ENERGY_TO_BITS[a]}${ENERGY_TO_BITS[b]}${ENERGY_TO_BITS[c]}`;
}

export type ThemeName =
  | "ModSum"
  | "TimeBand"
  | "WeightedRomantic"
  | "ParityRitual"
  | "AbsDiffTension";

export function calcTripletByTheme(
  date: Date,
  theme: ThemeName,
  opts?: { bias?: TimeBandBias }
): Triplet {
  switch (theme) {
    case "ModSum":
      return calcModSum(date);
    case "TimeBand":
      return calcTimeBand(
        date,
        opts?.bias ?? { morning: 1, day: 2, evening: 3, night: 0 }
      );
    case "WeightedRomantic":
      return calcWeightedRomantic(date);
    case "ParityRitual":
      return calcParityRitual(date);
    case "AbsDiffTension":
      return calcAbsDiffTension(date);
    default:
      return calcModSum(date);
  }
}

export function getHexagramByTheme(
  date: Date,
  theme: ThemeName,
  opts?: { bias?: TimeBandBias }
) {
  const triplet = calcTripletByTheme(date, theme, opts);
  const key = energiesToHexagramKey(triplet);
  const interpretation = guaInterpretations[key];
  return { key, energies: triplet, interpretation };
}

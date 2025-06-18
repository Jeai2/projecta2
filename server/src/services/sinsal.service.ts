// src/services/sinsal.service.ts
// jjhome 만세력 엔진 - 통합 신살(神殺) 계산 서비스 v3 (타입-안전, 전체 규칙 적용)
// 12신살과 유산 코드의 모든 길신/흉살을 명확한 타입과 구조로 계산한다.

import { GANJI } from '../data/saju.data';

// -----------------------------------------------------------------------------
// 1. 타입 및 데이터 정의 (Types & Data Definitions)
// -----------------------------------------------------------------------------

type PillarKey = 'year' | 'month' | 'day' | 'hour';
type Pillar = { key: PillarKey; gan: string; ji: string; ganji: string };
type SajuInfo = { pillars: Pillar[]; dayGan: string; dayJi: string; monthJi: string; yearJi: string, dayGanji: string, gender: 'M' | 'W' };
type SinsalResult = { [key in PillarKey]: string[] };
type BaseKey = 'dayGan' | 'dayJi' | 'monthJi' | 'yearJi';

// 신살 규칙의 종류를 명확한 타입으로 정의
type GanjiRule = { type: 'ganji'; values: string[] };
type PairRule = { type: 'pair'; base: 'dayJi' | 'yearJi'; pairs: { [key: string]: string } };
type CriteriaRule = { type: 'criteria'; base: BaseKey; target: 'gan' | 'ji'; rules: { [key: string]: string | string[] } };
type SinsalRule = GanjiRule | PairRule | CriteriaRule;

// [주석] 유산 코드(sinsal1.txt)의 모든 규칙을 타입-안전 구조로 재구성합니다.
const SINSAL_RULES: { [sinsalName: string]: SinsalRule } = {
    // --- 길신 (Auspicious Stars) ---
    '천을귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲,무,경': ['丑', '未'], '乙,己': ['子', '申'], '丙,丁': ['亥', '酉'], '壬,癸': ['巳', '卯'], '辛': ['午', '寅'] } },
    '태극귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲,乙': ['子', '午'], '丙,丁': ['卯', '酉'], '戊,己': ['辰', '戌', '丑', '未'], '庚,辛': ['寅', '亥'], '壬,癸': ['巳', '申'] } },
    '천덕귀인': { type: 'criteria', base: 'monthJi', target: 'gan', rules: { '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚' } },
    '월덕귀인': { type: 'criteria', base: 'monthJi', target: 'gan', rules: { '인,오,술': '丙', '사,유,축': '庚', '신,자,진': '壬', '해,묘,미': '甲' } },
    '문창귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '巳', '乙': '午', '丙,戊': '申', '丁,己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' } },
    '금여': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '辰', '乙': '巳', '丙,戊': '未', '丁,己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅' } },
    '암록': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '亥', '乙': '戌', '丙,戊': '申', '丁,己': '未', '庚': '巳', '辛': '辰', '壬': '寅', '癸': '丑' } },
    '학당귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '亥', '乙': '午', '丙,戊': '寅', '丁,己': '酉', '庚': '巳', '辛': '子', '壬': '申', '癸': '卯' } },
    '천관귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '未', '乙': '辰', '丙': '巳', '丁': '寅', '戊': '卯', '己': '酉', '庚': '亥', '辛': '申', '壬': '酉', '癸': '午' } },
    '천주귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲,丙': '巳', '乙,丁': '午', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' } },
    '문곡귀인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '亥', '乙': '子', '丙,戊': '寅', '丁,己': '卯', '庚': '巳', '辛': '午', '壬': '申', '癸': '酉' } },

    // --- 흉살 (Inauspicious Stars) ---
    '양인': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲': '卯', '丙,戊': '午', '庚': '酉', '壬': '子' } },
    '백호': { type: 'ganji', values: ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'] },
    '괴강': { type: 'ganji', values: ['庚辰', '庚戌', '壬辰', '壬戌', '戊戌'] },
    '원진': { type: 'pair', base: 'dayJi', pairs: { '子': '未', '丑': '午', '寅': '酉', '卯': '申', '辰': '亥', '巳': '戌' } },
    '귀문관': { type: 'pair', base: 'dayJi', pairs: { '子': '酉', '丑': '午', '寅': '未', '卯': '申', '辰': '亥', '巳': '戌' } },
    '급각': { type: 'criteria', base: 'monthJi', target: 'ji', rules: { '인,묘,진': ['亥', '子'], '사,오,미': ['卯', '未'], '신,유,술': ['寅', '戌'], '해,자,축': ['丑', '辰'] } },
    '홍염': { type: 'criteria', base: 'dayGan', target: 'ji', rules: { '甲,乙': '午', '丙': '寅', '丁': '未', '戊,己': '辰', '庚': '戌', '辛': '酉', '壬': '子', '癸': '申' } },
    '탕화': { type: 'criteria', base: 'dayJi', target: 'ji', rules: { '인,오,술': '午', '사,유,축': '丑', '신,자,진': '寅' } }, // 일지 기준 삼합으로 단순화
};

// 12신살 규칙 데이터
const SINSAL_12_NAMES = ['겁살', '재살', '천살', '지살', '연살', '월살', '망신살', '장성살', '반안살', '역마살', '육해살', '화개살'];
const SINSAL_12_GROUP_START_INDEX: { [key: string]: number } = {
    '해': 9, '묘': 9, '미': 9, '인': 0, '오': 0, '술': 0,
    '사': 3, '유': 3, '축': 3, '신': 6, '자': 6, '진': 6,
};
const JIJI_ORDER_FOR_12SINSAL = ['인', '묘', '진', '사', '오', '미', '신', '유', '술', '해', '자', '축'];


// -----------------------------------------------------------------------------
// 2. 신살 계산 엔진 (Sinsal Calculation Engine)
// -----------------------------------------------------------------------------

// [주석] 성별에 따라 달라지는 특수 신살(고신, 과숙)을 계산하는 함수
function calculateGoshinGwasuk(saju: SajuInfo, result: SinsalResult) {
    const { gender, yearJi, pillars } = saju;
    const GOSHIN_RULE: { [key: string]: string } = { '인,묘,진': '巳', '사,오,미': '申', '신,유,술': '亥', '해,자,축': '寅' };
    const GWASUK_RULE: { [key: string]: string } = { '인,묘,진': '丑', '사,오,미': '辰', '신,유,술': '未', '해,자,축': '戌' };
    
    const rule = gender === 'M' ? GOSHIN_RULE : GWASUK_RULE;
    const sinsalName = gender === 'M' ? '고신' : '과숙';

    for (const [key, targetJi] of Object.entries(rule)) {
        if (key.split(',').includes(yearJi)) {
            pillars.forEach(p => {
                if (p.ji === targetJi) {
                    result[p.key].push(sinsalName);
                }
            });
        }
    }
}

// [주석] 일주를 기준으로 공망을 계산하는 함수
function calculateGongmang(saju: SajuInfo, result: SinsalResult) {
    const GONGMANG_MAP: { [key: string]: string[] } = {
        '갑자순': ['戌', '亥'], '갑술순': ['申', '酉'], '갑신순': ['午', '未'],
        '갑오순': ['辰', '巳'], '갑진순': ['寅', '卯'], '갑인순': ['子', '丑'],
    };
    const cycleStart = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
    let currentCycle = '';
    const dayGanjiIndex = GANJI.indexOf(saju.dayGanji);

    for (const start of cycleStart) {
        const startIndex = GANJI.indexOf(start);
        if (dayGanjiIndex >= startIndex && dayGanjiIndex < startIndex + 10) {
            currentCycle = start + '순';
            break;
        }
    }
    
    const gongmangPair = GONGMANG_MAP[currentCycle];
    if (gongmangPair) {
        saju.pillars.forEach(p => {
            if (gongmangPair.includes(p.ji)) {
                result[p.key].push('공망');
            }
        });
    }
}

/**
 * 모든 신살을 계산하여 반환하는 메인 함수
 */
export const getAllSinsals = (pillars: { year: string, month: string, day: string, hour: string }, gender: 'M' | 'W'): SinsalResult => {
    
    const pillarArray: Pillar[] = [
        { key: 'year', gan: pillars.year[0], ji: pillars.year[1], ganji: pillars.year },
        { key: 'month', gan: pillars.month[0], ji: pillars.month[1], ganji: pillars.month },
        { key: 'day', gan: pillars.day[0], ji: pillars.day[1], ganji: pillars.day },
        { key: 'hour', gan: pillars.hour[0], ji: pillars.hour[1], ganji: pillars.hour },
    ];
    
    const saju: SajuInfo = {
        pillars: pillarArray, dayGan: pillars.day[0], dayJi: pillars.day[1],
        monthJi: pillars.month[1], yearJi: pillars.year[1], dayGanji: pillars.day, gender
    };
    
    const result: SinsalResult = { year: [], month: [], day: [], hour: [] };
    if (!saju.dayJi) return result;

    // 1. 12신살 계산 (일지 기준)
    const startIndex12 = SINSAL_12_GROUP_START_INDEX[saju.dayJi];
    if (typeof startIndex12 === 'number') {
        saju.pillars.forEach(p => {
            const jiIndex = JIJI_ORDER_FOR_12SINSAL.indexOf(p.ji);
            if (jiIndex !== -1) {
                const sinsalIndex = (startIndex12 + jiIndex) % 12;
                result[p.key].push(SINSAL_12_NAMES[sinsalIndex]);
            }
        });
    }

    // 2. 기타 신살 계산
    Object.entries(SINSAL_RULES).forEach(([sinsalName, rule]) => {
        // [오류 수정] switch-case 블록 내에서 변수 선언 시 스코프 문제를 피하기 위해, 각 case를 { } 로 감싸줍니다.
        switch (rule.type) {
            case 'ganji': {
                saju.pillars.forEach(p => { if (rule.values.includes(p.ganji) && !result[p.key].includes(sinsalName)) result[p.key].push(sinsalName); });
                break;
            }
            case 'pair': {
                const baseValue = saju[rule.base];
                const pairValue = rule.pairs[baseValue];
                if (pairValue) {
                    saju.pillars.forEach(p => { if (p.ji === pairValue || rule.pairs[p.ji] === baseValue) { if (!result[p.key].includes(sinsalName)) result[p.key].push(sinsalName); } });
                }
                break;
            }
            case 'criteria': {
                const criteriaBase = saju[rule.base];
                for (const [key, target] of Object.entries(rule.rules)) {
                    if (key.split(',').includes(criteriaBase)) {
                        saju.pillars.forEach(p => {
                            const targetValue = rule.target === 'gan' ? p.gan : p.ji;
                            const targets = Array.isArray(target) ? target : [target];
                            if (targets.includes(targetValue) && !result[p.key].includes(sinsalName)) {
                                result[p.key].push(sinsalName);
                            }
                        });
                    }
                }
                break;
            }
        }
    });
    
    // 3. 특수 로직 신살 계산
    calculateGoshinGwasuk(saju, result);
    calculateGongmang(saju, result);

    return result;
};

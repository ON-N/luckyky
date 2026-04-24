import type { FortuneGrade, WuXing, WuXingRelation } from '@/types';

const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
type HeavenlyStem = typeof HEAVENLY_STEMS[number];

const STEM_TO_WUXING: Record<HeavenlyStem, WuXing> = {
  '갑': '木', '을': '木',
  '병': '火', '정': '火',
  '무': '土', '기': '土',
  '경': '金', '신': '金',
  '임': '水', '계': '水',
};

// 상생: A → B 이면 A가 B를 생함
const GENERATES: Record<WuXing, WuXing> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

// 상극: A → B 이면 A가 B를 극함
const OVERCOMES: Record<WuXing, WuXing> = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

function stemFromIndex(index: number): HeavenlyStem {
  return HEAVENLY_STEMS[((index % 10) + 10) % 10];
}

// 기준: 1900-01-01 = 甲(인덱스 0)
function daysSince1900(localDateStr: string): number {
  const BASE = Date.UTC(1900, 0, 1);
  const [y, m, d] = localDateStr.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  return Math.floor((target - BASE) / 86_400_000);
}

// 날짜 문자열(YYYY-MM-DD)로 일간(日干) 천간 계산 — 출생일과 오늘 날짜 모두에 사용
export function getStemFromDate(localDateStr: string): HeavenlyStem {
  return stemFromIndex(daysSince1900(localDateStr));
}

export function getWuXingFromDate(localDateStr: string): WuXing {
  return STEM_TO_WUXING[getStemFromDate(localDateStr)];
}

// 12지신: (year + 8) % 12, 기준 1984(甲子)=쥐(0) ✓
export function getZodiacIndex(birthYear: number): number {
  return ((birthYear + 8) % 12 + 12) % 12;
}

export function getRelation(mine: WuXing, today: WuXing): WuXingRelation {
  if (mine === today) return '비화';
  if (GENERATES[today] === mine) return '생아';
  if (GENERATES[mine] === today) return '아생';
  if (OVERCOMES[mine] === today) return '아극';
  return '극아';
}

export function relationToGrade(r: WuXingRelation): FortuneGrade {
  switch (r) {
    case '생아': return '대길';
    case '아생': return '중길';
    case '비화': return '소길';
    case '아극': return '평';
    case '극아': return '말길';
  }
}

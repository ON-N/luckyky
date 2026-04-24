'use client';

import { useMemo, useState, useEffect } from 'react';
import { Fortune, FortuneInput, FortuneResult } from '@/types';
import { FORTUNES } from '@/data/fortunes';
import { WUXING_LUCKY, ZODIAC } from '@/data/sajuFortunes';
import { getStemFromDate, getWuXingFromDate, getRelation, relationToGrade, getZodiacIndex } from '@/lib/saju';

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) ^ char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getLocalDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useFortune(input: FortuneInput | null): FortuneResult {
  const [isLoading, setIsLoading] = useState(false);

  const { fortune, seed, saju } = useMemo<Pick<FortuneResult, 'fortune' | 'seed' | 'saju'>>(() => {
    if (!input) return { fortune: null, seed: 0 };

    const today = getLocalDateString();

    if (input.birthday) {
      // 일간(日干) 기준 — 출생일 자체의 천간이 "자기 기운"
      const birthWuXing = getWuXingFromDate(input.birthday);
      const todayWuXing = getWuXingFromDate(today);
      const relation = getRelation(birthWuXing, todayWuXing);
      const grade = relationToGrade(relation);

      // 등급 풀에서 (생일 + 이름 + 오늘)로 결정론적 선택 — 이름이 텍스트 다양성에 기여
      const gradePool = FORTUNES.filter(f => f.grade === grade);
      const s = hashString(`${input.birthday}::${input.name.trim()}::${today}`);
      const base = gradePool[s % gradePool.length];
      const lucky = WUXING_LUCKY[birthWuXing];

      const birthYear = parseInt(input.birthday.split('-')[0], 10);
      return {
        fortune: { ...base, luckyItem: lucky.item, luckyColor: lucky.color, luckyFood: lucky.food, luckyNumber: lucky.number },
        seed: s,
        saju: {
          birthWuXing,
          todayWuXing,
          relation,
          birthStem: getStemFromDate(input.birthday),
          todayStem: getStemFromDate(today),
          zodiac: ZODIAC[getZodiacIndex(birthYear)],
        },
      };
    }

    // 이름만 입력 — 기존 해시 방식
    const name = input.name.trim();
    if (!name) return { fortune: null, seed: 0 };

    const s = hashString(`${name}::${today}`);
    return { fortune: FORTUNES[s % FORTUNES.length], seed: s };
  }, [input]);

  useEffect(() => {
    if (input) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [input]);

  return { fortune, seed, isLoading, saju };
}

'use client';

import { useMemo, useState, useEffect } from 'react';
import { Fortune, FortuneInput, FortuneResult } from '@/types';
import { FORTUNES } from '@/data/fortunes';

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

  const fortune = useMemo<Fortune | null>(() => {
    if (!input) return null;

    const normalizedInput =
      input.inputType === 'name'
        ? input.name.trim()
        : input.birthday;

    if (!normalizedInput) return null;

    const dateString = getLocalDateString();
    const seedString = `${normalizedInput}::${dateString}`;
    const seed = hashString(seedString);
    const index = seed % FORTUNES.length;

    return FORTUNES[index];
  }, [input]);

  const seed = useMemo<number>(() => {
    if (!input) return 0;
    const normalizedInput =
      input.inputType === 'name' ? input.name.trim() : input.birthday;
    if (!normalizedInput) return 0;
    const dateString = getLocalDateString();
    const seedString = `${normalizedInput}::${dateString}`;
    return hashString(seedString);
  }, [input]);

  useEffect(() => {
    if (input) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [input]);

  return { fortune, seed, isLoading };
}

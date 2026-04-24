export type FortuneGrade = '대길' | '중길' | '소길' | '평' | '말길';

export interface Fortune {
  id: number;
  grade: FortuneGrade;
  title: string;
  body: string;
  luckyItem: string;
  luckyColor: string;
  luckyFood: string;
  luckyNumber: number;
}

export type WuXing = '木' | '火' | '土' | '金' | '水';
export type WuXingRelation = '생아' | '아생' | '비화' | '아극' | '극아';

export interface ZodiacInfo {
  name: string;
  emoji: string;
}

export interface SajuContext {
  birthWuXing: WuXing;
  todayWuXing: WuXing;
  relation: WuXingRelation;
  birthStem: string;
  todayStem: string;
  zodiac: ZodiacInfo;
}

export interface FortuneResult {
  fortune: Fortune | null;
  seed: number;
  isLoading: boolean;
  saju?: SajuContext;
}

export interface FortuneInput {
  name: string;
  birthday: string;
}

export interface GradeConfig {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

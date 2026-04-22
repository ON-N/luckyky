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

export interface FortuneResult {
  fortune: Fortune | null;
  seed: number;
  isLoading: boolean;
}

export interface FortuneInput {
  name: string;
  birthday: string;
  inputType: 'name' | 'birthday';
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

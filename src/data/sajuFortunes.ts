import type { WuXing, WuXingRelation } from '@/types';

export const WUXING_LUCKY: Record<WuXing, {
  item: string;
  color: string;
  food: string;
  number: number;
}> = {
  '木': { item: '초록 식물',    color: '초록색', food: '나물 비빔밥', number: 3 },
  '火': { item: '붉은 초',      color: '빨간색', food: '불고기',      number: 7 },
  '土': { item: '도자기 소품',  color: '황색',   food: '된장찌개',    number: 5 },
  '金': { item: '은 장신구',    color: '흰색',   food: '전복죽',      number: 1 },
  '水': { item: '물고기 그림',  color: '남색',   food: '해물탕',      number: 6 },
};

export const WUXING_BADGE: Record<WuXing, { bg: string; fg: string }> = {
  '木': { bg: '#D7F0D4', fg: '#155F36' },
  '火': { bg: '#FFE5E5', fg: '#7C0000' },
  '土': { bg: '#FFF3CD', fg: '#6B4C00' },
  '金': { bg: '#F0F0F0', fg: '#444444' },
  '水': { bg: '#DDE8F8', fg: '#1A2F6B' },
};

export const WUXING_EMOJI: Record<WuXing, string> = {
  '木': '🌿', '火': '🔥', '土': '🌏', '金': '✨', '水': '💧',
};

export const STEM_HANJA: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸',
};

export const RELATION_DESC: Record<WuXingRelation, { title: string; desc: string }> = {
  '생아': { title: '오늘이 나를 생하는 날',     desc: '오늘의 기운이 당신을 북돋워주는 날이에요' },
  '아생': { title: '내가 오늘을 생하는 날',     desc: '당신의 기운이 오늘의 흐름을 만들어가요' },
  '비화': { title: '같은 기운이 흐르는 날',     desc: '오늘의 기운이 당신과 같아 안정적이에요' },
  '아극': { title: '내가 오늘을 다스리는 날',   desc: '힘을 쓰는 만큼 소모도 있는 날이에요' },
  '극아': { title: '오늘이 나를 누르는 날',     desc: '기운을 아끼고 신중하게 움직여요' },
};

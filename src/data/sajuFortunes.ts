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

export const ZODIAC = [
  { name: '쥐',    emoji: '🐭' },
  { name: '소',    emoji: '🐄' },
  { name: '호랑이', emoji: '🐅' },
  { name: '토끼',  emoji: '🐰' },
  { name: '용',    emoji: '🐉' },
  { name: '뱀',    emoji: '🐍' },
  { name: '말',    emoji: '🐴' },
  { name: '양',    emoji: '🐑' },
  { name: '원숭이', emoji: '🐒' },
  { name: '닭',    emoji: '🐓' },
  { name: '개',    emoji: '🐕' },
  { name: '돼지',  emoji: '🐷' },
];

export const COMPAT_INFO: Record<WuXingRelation, { score: number; hearts: number; title: string; desc: string }> = {
  '아생': { score: 88, hearts: 5, title: '베푸는 인연', desc: '한 사람이 다른 사람에게 힘을 주는 상생의 관계예요. 서로 성장하게 해주는 좋은 인연이에요.' },
  '생아': { score: 88, hearts: 5, title: '받는 인연',   desc: '한 사람이 다른 사람에게 힘을 주는 상생의 관계예요. 든든한 버팀목이 되어주는 인연이에요.' },
  '비화': { score: 78, hearts: 4, title: '같은 기운의 인연', desc: '두 사람의 기운이 같아 서로를 깊이 이해해요. 편안하고 안정적인 관계예요.' },
  '아극': { score: 65, hearts: 3, title: '이끄는 인연', desc: '한 사람이 다른 사람에게 영향을 주는 관계예요. 적당한 긴장감이 발전의 원동력이 돼요.' },
  '극아': { score: 65, hearts: 3, title: '따르는 인연', desc: '한 사람이 다른 사람에게 영향을 주는 관계예요. 자극을 받으며 함께 성장할 수 있어요.' },
};

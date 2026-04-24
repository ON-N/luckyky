import type { Fortune, SajuContext } from '@/types';
import { WUXING_EMOJI, STEM_HANJA, RELATION_DESC, WUXING_BADGE } from '@/data/sajuFortunes';

const W = 750;
const PAD = 50;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxW: number, lh: number): number {
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW && line.length > 0) {
      ctx.fillText(line, cx, y);
      line = ch;
      y += lh;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, cx, y);
  return y;
}

function divider(ctx: CanvasRenderingContext2D, y: number) {
  ctx.strokeStyle = 'rgba(31,138,76,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
}

const GRADE_BG: Record<string, string> = {
  '대길': '#34C759', '중길': '#6FCF7B', '소길': '#A9DDB0', '평': '#C9D6C4', '말길': '#8AA59B',
};
const GRADE_FG: Record<string, string> = {
  '대길': '#0A2416', '중길': '#0A2416', '소길': '#155F36', '평': '#155F36', '말길': '#F3FAF1',
};
const GRADE_STARS: Record<string, string> = {
  '대길': '★★★★★', '중길': '★★★★', '소길': '★★★', '평': '★★', '말길': '★',
};

function localDateDisplay(): string {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
}

export async function generateFortuneImage(
  fortune: Fortune,
  saju: SajuContext | undefined,
  userName: string,
): Promise<string> {
  await document.fonts.ready;

  // 높이 계산: saju 있으면 더 길게
  const H = saju ? 1280 : 1020;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 배경
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(1, '#E6F5E4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 우상단 ambient blob
  const blobGrad = ctx.createRadialGradient(W - 60, 60, 0, W - 60, 60, 200);
  blobGrad.addColorStop(0, 'rgba(111,207,123,0.3)');
  blobGrad.addColorStop(1, 'rgba(111,207,123,0)');
  ctx.fillStyle = blobGrad;
  ctx.beginPath();
  ctx.arc(W - 60, 60, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  let y = 64;

  // 앱 헤더
  ctx.font = 'bold 28px "Gaegu", cursive';
  ctx.fillStyle = '#155F36';
  ctx.fillText('🍀 우리들의 운세 아지트', W / 2, y);
  y += 36;

  ctx.font = '20px "Noto Sans KR", sans-serif';
  ctx.fillStyle = '#6F857B';
  const who = userName.trim();
  ctx.fillText(`${localDateDisplay()}${who ? '  ·  ' + who : ''}`, W / 2, y);
  y += 30;

  divider(ctx, y); y += 36;

  // 등급 배지
  const badgeLabel = `${fortune.grade}  ${GRADE_STARS[fortune.grade]}`;
  ctx.font = 'bold 26px "Gaegu", cursive';
  const bw = ctx.measureText(badgeLabel).width + 52;
  const bh = 46;
  const bx = (W - bw) / 2;
  ctx.fillStyle = GRADE_BG[fortune.grade] ?? '#C9D6C4';
  rr(ctx, bx, y, bw, bh, bh / 2);
  ctx.fill();
  ctx.fillStyle = GRADE_FG[fortune.grade] ?? '#155F36';
  ctx.fillText(badgeLabel, W / 2, y + 31);
  y += bh + 20;

  // 띠 (zodiac)
  if (saju?.zodiac) {
    ctx.font = '22px "Noto Sans KR", sans-serif';
    ctx.fillStyle = '#6F857B';
    ctx.fillText(`${saju.zodiac.emoji} ${saju.zodiac.name}띠`, W / 2, y);
    y += 34;
  }

  // 운세 제목
  ctx.font = 'bold 38px "Gaegu", cursive';
  ctx.fillStyle = '#155F36';
  ctx.fillText(fortune.title, W / 2, y);
  y += 48;

  divider(ctx, y); y += 36;

  // 운세 본문 (줄바꿈 처리)
  ctx.font = '23px "Noto Sans KR", sans-serif';
  ctx.fillStyle = '#3C5B4E';
  y = wrapText(ctx, fortune.body, W / 2, y, W - PAD * 2 - 20, 36) + 36;

  // 오행 분석
  if (saju) {
    const birth = WUXING_BADGE[saju.birthWuXing];
    const today = WUXING_BADGE[saju.todayWuXing];
    const rel = RELATION_DESC[saju.relation];

    // 섹션 배경
    rr(ctx, PAD, y, W - PAD * 2, 180, 20);
    ctx.fillStyle = birth.bg + '80';
    ctx.fill();

    // 섹션 제목
    ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
    ctx.fillStyle = '#6F857B';
    ctx.fillText('오행 분석', W / 2, y + 26);

    // 내 기운 박스
    const boxW = 190, boxH = 100, gap = 60;
    const boxY = y + 38;
    const box1X = (W - boxW * 2 - gap) / 2;
    const box2X = box1X + boxW + gap;

    rr(ctx, box1X, boxY, boxW, boxH, 14);
    ctx.fillStyle = birth.bg;
    ctx.fill();

    rr(ctx, box2X, boxY, boxW, boxH, 14);
    ctx.fillStyle = today.bg;
    ctx.fill();

    // 화살표
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#6F857B';
    ctx.fillText('→', W / 2, boxY + boxH / 2 + 10);

    // 박스 텍스트
    ctx.textAlign = 'center';
    [
      { bx: box1X + boxW / 2, stem: saju.birthStem, wx: saju.birthWuXing, fg: birth.fg, emoji: WUXING_EMOJI[saju.birthWuXing], label: '내 기운' },
      { bx: box2X + boxW / 2, stem: saju.todayStem, wx: saju.todayWuXing, fg: today.fg, emoji: WUXING_EMOJI[saju.todayWuXing], label: '오늘 기운' },
    ].forEach(({ bx, stem, wx, fg, emoji, label }) => {
      ctx.font = '14px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#6F857B';
      ctx.fillText(label, bx, boxY - 8);

      ctx.font = '26px sans-serif';
      ctx.fillStyle = fg;
      ctx.fillText(emoji, bx, boxY + 34);

      ctx.font = 'bold 20px "Gaegu", cursive';
      ctx.fillStyle = fg;
      ctx.fillText(`${STEM_HANJA[stem]} ${stem}`, bx, boxY + 62);

      ctx.font = '15px "Noto Sans KR", sans-serif';
      ctx.fillStyle = fg;
      ctx.fillText(wx, bx, boxY + 86);
    });

    // 관계 설명
    ctx.font = 'bold 20px "Noto Sans KR", sans-serif';
    ctx.fillStyle = birth.fg;
    ctx.fillText(rel.title, W / 2, y + 155);

    y += 194;
  }

  divider(ctx, y); y += 30;

  // 행운 타일 (2×2)
  const tileW = 308, tileH = 108, tileGap = 18;
  const gridX = (W - (tileW * 2 + tileGap)) / 2;
  const tiles = [
    { emoji: '🍀', label: '행운 아이템', value: fortune.luckyItem },
    { emoji: '🎨', label: '행운 색상',   value: fortune.luckyColor },
    { emoji: '🍽️', label: '행운 음식',  value: fortune.luckyFood },
    { emoji: '🔢', label: '행운 숫자',   value: String(fortune.luckyNumber) },
  ];

  tiles.forEach(({ emoji, label, value }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tx = gridX + col * (tileW + tileGap);
    const ty = y + row * (tileH + tileGap);

    rr(ctx, tx, ty, tileW, tileH, 20);
    ctx.fillStyle = '#D7F0D4';
    ctx.fill();

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#0F2A1D';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, tx + tileW / 2, ty + 36);

    ctx.font = '16px "Noto Sans KR", sans-serif';
    ctx.fillStyle = '#3C5B4E';
    ctx.fillText(label, tx + tileW / 2, ty + 60);

    ctx.font = `bold ${label === '행운 숫자' ? '32px' : '22px'} "${label === '행운 숫자' ? 'Gaegu' : 'Noto Sans KR'}", sans-serif`;
    ctx.fillStyle = '#0F2A1D';
    ctx.fillText(value, tx + tileW / 2, ty + 92);
  });
  y += 2 * (tileH + tileGap) + 30;

  // 푸터
  ctx.font = '18px "Noto Sans KR", sans-serif';
  ctx.fillStyle = '#A0B8AE';
  ctx.fillText('재미로만 즐겨주세요 · 우리들의 운세 아지트 🍀', W / 2, H - 30);

  return canvas.toDataURL('image/png');
}

import type { Fortune, SajuContext } from '@/types';
import { WUXING_EMOJI, STEM_HANJA, RELATION_DESC, WUXING_BADGE } from '@/data/sajuFortunes';

const W = 750;
const PAD = 48;
const HEADER_H = 268;
const LINE_H = 32;

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

function measureLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW && line.length > 0) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx: CanvasRenderingContext2D, lines: string[], cx: number, y: number, lh: number): number {
  for (const line of lines) {
    ctx.fillText(line, cx, y);
    y += lh;
  }
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

  // Measure body text lines with a probe canvas
  const probe = document.createElement('canvas');
  probe.width = W;
  const pc = probe.getContext('2d')!;
  pc.font = `22px "Noto Sans KR", sans-serif`;
  const bodyLines = measureLines(pc, fortune.body, W - PAD * 2 - 20);
  const bodyTextH = bodyLines.length * LINE_H;

  // Calculate total canvas height
  let calcY = HEADER_H + 48;         // header + top padding
  calcY += 50;                        // title
  calcY += 28;                        // post-divider
  calcY += bodyTextH + 36;            // body text section
  if (saju) calcY += 220;             // ohaeng section (196 bg + 24 gap)
  calcY += 24;                        // pre-lucky divider
  calcY += 2 * (104 + 16);           // lucky grid 2 rows (matches drawing advance)
  calcY += 56;                        // footer: text at +28, bottom margin +28

  const H = calcY;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.textAlign = 'center';

  // === HEADER: dark green gradient ===
  const hg = ctx.createLinearGradient(0, 0, W * 0.7, HEADER_H);
  hg.addColorStop(0, '#0A2416');
  hg.addColorStop(0.55, '#155F36');
  hg.addColorStop(1, '#1F8A4C');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, HEADER_H);

  // Ambient glow – top-right
  const ag1 = ctx.createRadialGradient(W - 20, 20, 0, W - 20, 20, 210);
  ag1.addColorStop(0, 'rgba(111,207,123,0.32)');
  ag1.addColorStop(1, 'rgba(111,207,123,0)');
  ctx.fillStyle = ag1;
  ctx.beginPath();
  ctx.arc(W - 20, 20, 210, 0, Math.PI * 2);
  ctx.fill();

  // Ambient glow – bottom-left
  const ag2 = ctx.createRadialGradient(50, HEADER_H, 0, 50, HEADER_H, 130);
  ag2.addColorStop(0, 'rgba(111,207,123,0.22)');
  ag2.addColorStop(1, 'rgba(111,207,123,0)');
  ctx.fillStyle = ag2;
  ctx.beginPath();
  ctx.arc(50, HEADER_H, 130, 0, Math.PI * 2);
  ctx.fill();

  // App name
  ctx.font = 'bold 27px "Gaegu", cursive';
  ctx.fillStyle = 'rgba(255,255,255,0.93)';
  ctx.fillText('🍀 우리들의 운세 아지트', W / 2, 68);

  // Date + user
  ctx.font = '19px "Noto Sans KR", sans-serif';
  ctx.fillStyle = 'rgba(169,221,176,0.85)';
  const who = userName.trim();
  ctx.fillText(`${localDateDisplay()}${who ? '  ·  ' + who : ''}`, W / 2, 103);

  // Grade badge
  ctx.font = 'bold 32px "Gaegu", cursive';
  const badgeText = `${fortune.grade}  ${GRADE_STARS[fortune.grade]}`;
  const bw = ctx.measureText(badgeText).width + 72;
  const bh = 58;
  const bx = (W - bw) / 2;
  const by = 130;
  rr(ctx, bx, by, bw, bh, bh / 2);
  ctx.fillStyle = GRADE_BG[fortune.grade] ?? '#C9D6C4';
  ctx.fill();
  ctx.fillStyle = GRADE_FG[fortune.grade] ?? '#155F36';
  ctx.fillText(badgeText, W / 2, by + 40);

  // Zodiac (if saju)
  if (saju?.zodiac) {
    ctx.font = '20px "Noto Sans KR", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.fillText(`${saju.zodiac.emoji} ${saju.zodiac.name}띠`, W / 2, by + bh + 30);
  }

  // === WHITE BODY ===
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, HEADER_H, W, H - HEADER_H);

  let y = HEADER_H + 48;

  // Fortune title
  ctx.font = 'bold 38px "Gaegu", cursive';
  ctx.fillStyle = '#155F36';
  ctx.fillText(fortune.title, W / 2, y);
  y += 50;

  divider(ctx, y); y += 28;

  // Body text on soft green background
  const bodyBgH = bodyTextH + 54;
  rr(ctx, PAD - 8, y - 14, W - (PAD - 8) * 2, bodyBgH, 18);
  ctx.fillStyle = '#F3FAF1';
  ctx.fill();

  ctx.font = '22px "Noto Sans KR", sans-serif';
  ctx.fillStyle = '#3C5B4E';
  y = drawLines(ctx, bodyLines, W / 2, y + 8, LINE_H) + 28;

  // === OHAENG SECTION ===
  if (saju) {
    const birth = WUXING_BADGE[saju.birthWuXing];
    const today = WUXING_BADGE[saju.todayWuXing];
    const rel = RELATION_DESC[saju.relation];

    const ohaengBgH = 196;
    rr(ctx, PAD - 8, y, W - (PAD - 8) * 2, ohaengBgH, 20);
    ctx.fillStyle = birth.bg + '50';
    ctx.fill();

    ctx.font = 'bold 15px "Noto Sans KR", sans-serif';
    ctx.fillStyle = '#6F857B';
    ctx.fillText('✦ 오행 분석', W / 2, y + 28);

    const boxW = 192, boxH = 108, boxGap = 52;
    const boxY = y + 46;
    const box1X = (W - boxW * 2 - boxGap) / 2;
    const box2X = box1X + boxW + boxGap;

    ([
      { bx: box1X, badge: birth, stem: saju.birthStem, wx: saju.birthWuXing, label: '내 기운', emoji: WUXING_EMOJI[saju.birthWuXing] },
      { bx: box2X, badge: today, stem: saju.todayStem, wx: saju.todayWuXing, label: '오늘 기운', emoji: WUXING_EMOJI[saju.todayWuXing] },
    ] as const).forEach(({ bx, badge, stem, wx, label, emoji }) => {
      ctx.font = '14px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#6F857B';
      ctx.fillText(label, bx + boxW / 2, boxY - 8);

      rr(ctx, bx, boxY, boxW, boxH, 16);
      ctx.fillStyle = badge.bg;
      ctx.fill();

      ctx.font = '28px sans-serif';
      ctx.fillStyle = badge.fg;
      ctx.fillText(emoji, bx + boxW / 2, boxY + 38);

      ctx.font = 'bold 22px "Gaegu", cursive';
      ctx.fillStyle = badge.fg;
      ctx.fillText(`${STEM_HANJA[stem]} ${stem}`, bx + boxW / 2, boxY + 68);

      ctx.font = '15px "Noto Sans KR", sans-serif';
      ctx.fillStyle = badge.fg;
      ctx.fillText(wx, bx + boxW / 2, boxY + 90);
    });

    // Arrow between boxes
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#6F857B';
    ctx.fillText('→', W / 2, boxY + boxH / 2 + 10);

    // Relation title
    ctx.font = 'bold 18px "Noto Sans KR", sans-serif';
    ctx.fillStyle = birth.fg;
    ctx.fillText(rel.title, W / 2, boxY + boxH + 22);

    y += ohaengBgH + 24;
  }

  divider(ctx, y); y += 24;

  // === LUCKY GRID (2×2) ===
  const tileW = 308, tileH = 104, tileGap = 16;
  const gridX = (W - (tileW * 2 + tileGap)) / 2;

  ([
    { emoji: '🍀', label: '행운 아이템', value: fortune.luckyItem },
    { emoji: '🎨', label: '행운 색상',   value: fortune.luckyColor },
    { emoji: '🍽️', label: '행운 음식',  value: fortune.luckyFood },
    { emoji: '🔢', label: '행운 숫자',   value: String(fortune.luckyNumber) },
  ] as const).forEach(({ emoji, label, value }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tx = gridX + col * (tileW + tileGap);
    const ty = y + row * (tileH + tileGap);

    rr(ctx, tx, ty, tileW, tileH, 20);
    ctx.fillStyle = '#D7F0D4';
    ctx.fill();

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#0F2A1D';
    ctx.fillText(emoji, tx + tileW / 2, ty + 34);

    ctx.font = '15px "Noto Sans KR", sans-serif';
    ctx.fillStyle = '#3C5B4E';
    ctx.fillText(label, tx + tileW / 2, ty + 58);

    const isNum = label === '행운 숫자';
    ctx.font = `bold ${isNum ? '30px' : '20px'} "${isNum ? 'Gaegu' : 'Noto Sans KR'}", sans-serif`;
    ctx.fillStyle = '#0F2A1D';
    ctx.fillText(value, tx + tileW / 2, ty + 92);
  });

  y += 2 * (tileH + tileGap);

  // === FOOTER ===
  ctx.font = '16px "Noto Sans KR", sans-serif';
  ctx.fillStyle = '#A0B8AE';
  ctx.fillText('재미로만 즐겨주세요 · 우리들의 운세 아지트 🍀', W / 2, y + 28);

  return canvas.toDataURL('image/png');
}

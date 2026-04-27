'use client';

import { useState, useEffect } from 'react';
import { motion, type Transition } from 'framer-motion';
import { Fortune, SajuContext } from '@/types';
import { WUXING_BADGE, WUXING_EMOJI, STEM_HANJA, RELATION_DESC } from '@/data/sajuFortunes';
import { generateFortuneImage } from '@/lib/generateImage';

interface FortuneCardProps {
  fortune: Fortune;
  userName: string;
  saju?: SajuContext;
}

const GRADE_STYLE: Record<string, { bg: string; fg: string; shimmer?: boolean }> = {
  '대길': { bg: '#34C759', fg: '#0A2416', shimmer: true },
  '중길': { bg: '#6FCF7B', fg: '#0A2416' },
  '소길': { bg: '#A9DDB0', fg: '#155F36' },
  '평':   { bg: '#C9D6C4', fg: '#155F36' },
  '말길': { bg: '#8AA59B', fg: '#F3FAF1' },
};

const GRADE_STARS: Record<string, string> = {
  '대길': '★★★★★',
  '중길': '★★★★',
  '소길': '★★★',
  '평':   '★★',
  '말길': '★',
};

export default function FortuneCard({ fortune, userName, saju }: FortuneCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareHover, setShareHover] = useState(false);
  const [imgHover, setImgHover] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const gs = GRADE_STYLE[fortune.grade] ?? GRADE_STYLE['평'];

  useEffect(() => {
    setIsFlipped(false);
    const t = setTimeout(() => setIsFlipped(true), 100);
    return () => clearTimeout(t);
  }, [fortune]);

  const handleShare = async () => {
    const who = userName || '나';
    const sajuLine = saju
      ? `\n\n🌿 오행: ${saju.birthStem}(${saju.birthWuXing}) → ${saju.todayStem}(${saju.todayWuXing}) · ${saju.relation}`
      : '';
    const text = `[우리들의 운세 아지트]\n오늘 ${who}의 운세: ${fortune.grade}\n\n${fortune.title}\n${fortune.body}${sajuLine}\n\n🍀 행운 아이템: ${fortune.luckyItem}\n🎨 행운 색상: ${fortune.luckyColor}\n🍽️ 행운 음식: ${fortune.luckyFood}\n🔢 행운 숫자: ${fortune.luckyNumber}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSaveImage = async () => {
    if (imgLoading) return;
    setImgLoading(true);
    try {
      const dataUrl = await generateFortuneImage(fortune, saju, userName);
      const blob = await (await fetch(dataUrl)).blob();

      // Mobile: Web Share API (shares the file directly)
      if (typeof navigator !== 'undefined' && navigator.share) {
        const file = new File([blob], '오늘의운세.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return;
        }
      }

      // Desktop: File System Access API (folder picker)
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        try {
          const handle = await (window as Window & { showSaveFilePicker: (opts: object) => Promise<FileSystemFileHandle> }).showSaveFilePicker({
            suggestedName: '오늘의운세.png',
            types: [{ description: 'PNG 이미지', accept: { 'image/png': ['.png'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (err) {
          if ((err as DOMException).name === 'AbortError') return;
          // fall through to <a> download
        }
      }

      // Fallback: anchor download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = '오늘의운세.png';
      a.click();
    } finally {
      setImgLoading(false);
    }
  };

  const jellyTransition: Transition = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] };

  return (
    <div style={{ perspective: '1000px', width: '100%' }}>
      {/* 높이는 뒷면 콘텐츠가 결정 — 앞면은 absolute로 덮음 */}
      <div style={{ position: 'relative', width: '100%' }}>

        {/* ── 카드 뒷면 (운세 결과) — normal flow, 높이 기준 ── */}
        <motion.div
          style={{
            width: '100%',
            borderRadius: '28px 34px 26px 30px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            background: '#fff',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-md)',
            padding: 22,
            boxSizing: 'border-box',
          }}
          initial={{ rotateY: -180 }}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={jellyTransition}
        >
          {/* ambient blob */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 180, height: 180,
            borderRadius: '64% 36% 58% 42% / 54% 48% 52% 46%',
            background: 'radial-gradient(circle at 30% 30%, rgba(111,207,123,0.45), rgba(111,207,123,0) 70%)',
            filter: 'blur(16px)', pointerEvents: 'none',
          }} />

          {/* 등급 배지 */}
          <div style={{ textAlign: 'center', position: 'relative', marginBottom: 12 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 999,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              background: gs.shimmer
                ? 'linear-gradient(90deg, #34C759, #A9DDB0, #34C759)'
                : gs.bg,
              backgroundSize: gs.shimmer ? '200% 100%' : undefined,
              animation: gs.shimmer ? 'lk-shimmer 2.4s linear infinite' : undefined,
              color: gs.fg,
              border: '1px solid rgba(31,138,76,0.18)',
            }}>
              {fortune.grade} {GRADE_STARS[fortune.grade]}
            </span>
          </div>

          {/* 제목 */}
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 24,
            color: 'var(--fg-brand)', textAlign: 'center',
            margin: '0 0 10px', fontWeight: 700, position: 'relative',
          }}>
            {fortune.title}
          </h3>

          <div style={{ height: 1, background: 'var(--line)', margin: '0 0 12px' }} />

          {/* 본문 */}
          <p style={{
            color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7,
            textAlign: 'center', margin: '0 0 12px',
            fontFamily: 'var(--font-sans)', position: 'relative',
          }}>
            {fortune.body}
          </p>

          {/* 오행 분석 */}
          {saju && (() => {
            const birth = WUXING_BADGE[saju.birthWuXing];
            const today = WUXING_BADGE[saju.todayWuXing];
            const rel = RELATION_DESC[saju.relation];
            return (
              <div style={{
                background: birth.bg + '55',
                borderRadius: 16,
                padding: '12px 14px',
                marginBottom: 12,
                position: 'relative',
                border: `1px solid ${birth.bg}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-mute)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>
                    오행 분석
                  </span>
                  {saju.zodiac && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 999,
                      background: birth.bg, color: birth.fg,
                      fontFamily: 'var(--font-sans)',
                    }}>
                      {saju.zodiac.emoji} {saju.zodiac.name}띠
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--ink-mute)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>내 기운</div>
                    <div style={{ background: birth.bg, color: birth.fg, borderRadius: 12, padding: '8px 14px', border: `1px solid ${birth.fg}22` }}>
                      <div style={{ fontSize: 20, lineHeight: 1 }}>{WUXING_EMOJI[saju.birthWuXing]}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: 4 }}>
                        {STEM_HANJA[saju.birthStem]} {saju.birthStem}
                      </div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--font-sans)', marginTop: 2, opacity: 0.8 }}>{saju.birthWuXing}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--ink-mute)', lineHeight: 1 }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--ink-mute)', marginBottom: 4, fontFamily: 'var(--font-sans)' }}>오늘 기운</div>
                    <div style={{ background: today.bg, color: today.fg, borderRadius: 12, padding: '8px 14px', border: `1px solid ${today.fg}22` }}>
                      <div style={{ fontSize: 20, lineHeight: 1 }}>{WUXING_EMOJI[saju.todayWuXing]}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: 4 }}>
                        {STEM_HANJA[saju.todayStem]} {saju.todayStem}
                      </div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--font-sans)', marginTop: 2, opacity: 0.8 }}>{saju.todayWuXing}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: birth.fg, fontFamily: 'var(--font-sans)' }}>{rel.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2, fontFamily: 'var(--font-sans)' }}>{rel.desc}</div>
                </div>
              </div>
            );
          })()}

          <div style={{ height: 1, background: 'var(--line)', margin: '0 0 12px' }} />

          {/* 행운 타일 */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 8, marginBottom: 14, position: 'relative',
          }}>
            {([
              ['🍀', '행운 아이템', fortune.luckyItem, false],
              ['🎨', '행운 색상',   fortune.luckyColor, false],
              ['🍽️', '행운 음식',  fortune.luckyFood,  false],
              ['🔢', '행운 숫자',   fortune.luckyNumber, true],
            ] as [string, string, string | number, boolean][]).map(([emoji, label, value, isNum]) => (
              <div key={label} style={{
                background: 'var(--green-100)',
                borderRadius: 18, padding: '10px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, marginBottom: 2 }} aria-hidden>{emoji}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginBottom: 2 }}>{label}</div>
                <div style={{
                  fontSize: isNum ? 22 : 13, fontWeight: 700,
                  color: isNum ? 'var(--fg-brand)' : 'var(--ink)',
                  fontFamily: isNum ? 'var(--font-display)' : 'var(--font-sans)',
                }}>{value}</div>
              </div>
            ))}
          </div>

          {/* 버튼 행 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleShare}
              onMouseEnter={() => setShareHover(true)}
              onMouseLeave={() => setShareHover(false)}
              style={{
                flex: 1, border: 'none',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14,
                padding: '13px 8px', borderRadius: 999,
                background: shareHover ? 'var(--green-500)' : 'var(--green-400)',
                color: '#0A2416', cursor: 'pointer',
                transform: shareHover ? 'translateY(-2px) scale(1.02)' : 'none',
                boxShadow: shareHover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'transform 150ms var(--ease-jelly), background 150ms, box-shadow 150ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              {copied ? '✓ 복사됐어요!' : '📋 텍스트 복사'}
            </button>
            <button
              onClick={handleSaveImage}
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
              disabled={imgLoading}
              style={{
                flex: 1, border: '1.5px solid var(--green-400)',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14,
                padding: '13px 8px', borderRadius: 999,
                background: imgHover ? 'var(--green-100)' : '#fff',
                color: 'var(--fg-brand)', cursor: imgLoading ? 'not-allowed' : 'pointer',
                opacity: imgLoading ? 0.6 : 1,
                transform: imgHover && !imgLoading ? 'translateY(-2px) scale(1.02)' : 'none',
                boxShadow: imgHover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'transform 150ms var(--ease-jelly), background 150ms, box-shadow 150ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              {imgLoading ? '⏳ 생성 중...' : '🖼 이미지 저장'}
            </button>
          </div>
        </motion.div>

        {/* ── 카드 앞면 (로딩) — absolute로 뒷면 위에 덮음 ── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '28px 34px 26px 30px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #fff, #E6F5E4)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={jellyTransition}
        >
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 160, height: 160,
            borderRadius: '64% 36% 58% 42% / 54% 48% 52% 46%',
            background: 'radial-gradient(circle at 30% 30%, rgba(111,207,123,0.45), rgba(111,207,123,0) 70%)',
            filter: 'blur(16px)', pointerEvents: 'none',
          }} />
          <div style={{ fontSize: 60, animation: 'lk-pulse 2s ease-in-out infinite' }}>🔮</div>
          <p style={{
            color: 'var(--fg-brand)', fontSize: 16, fontWeight: 700,
            fontFamily: 'var(--font-display)', margin: '16px 0 0',
          }}>
            운세를 불러오는 중...
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: 99,
                background: 'var(--green-400)',
                animation: `lk-bounce 1s ${i * 0.15}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

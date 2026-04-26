'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WuXing, WuXingRelation } from '@/types';
import { getWuXingFromDate, getStemFromDate, getRelation, getZodiacIndex } from '@/lib/saju';
import { WUXING_BADGE, WUXING_EMOJI, STEM_HANJA, COMPAT_INFO, ZODIAC } from '@/data/sajuFortunes';

// 배경 클로버 (고정 시드)
const CLOVERS = Array.from({ length: 10 }, (_, i) => ({
  id: i, x: (i * 37 + 11) % 97, y: (i * 53 + 7) % 93,
  size: 10 + (i * 7) % 14, delay: (i * 0.4) % 3, dur: 6 + (i * 0.6) % 6, rot: (i * 47) % 360,
}));

interface PersonInput { name: string; birthday: string; }

interface CompatResult {
  wx1: WuXing; wx2: WuXing;
  stem1: string; stem2: string;
  zodiac1: { name: string; emoji: string };
  zodiac2: { name: string; emoji: string };
  relation: WuXingRelation;
  name1: string; name2: string;
}

export default function CompatibilityPage() {
  const [a, setA] = useState<PersonInput>({ name: '', birthday: '' });
  const [b, setB] = useState<PersonInput>({ name: '', birthday: '' });
  const [result, setResult] = useState<CompatResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseBd = (raw: string): string | null => {
    const d = raw.replace(/\D/g, '');
    if (d.length !== 8) return null;
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!a.birthday || !b.birthday) { setError('두 분의 생년월일을 모두 입력해주세요.'); return; }
    const pa = parseBd(a.birthday), pb = parseBd(b.birthday);
    if (!pa || !pb) { setError('생년월일 8자리를 입력해주세요 (예: 20000105)'); return; }
    const da = new Date(pa), db = new Date(pb);
    if (isNaN(da.getTime()) || isNaN(db.getTime()) || da > new Date() || db > new Date()) {
      setError('올바른 생년월일을 입력해주세요.'); return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const wx1 = getWuXingFromDate(pa);
      const wx2 = getWuXingFromDate(pb);
      const y1 = parseInt(pa.split('-')[0], 10);
      const y2 = parseInt(pb.split('-')[0], 10);
      setResult({
        wx1, wx2,
        stem1: getStemFromDate(pa),
        stem2: getStemFromDate(pb),
        zodiac1: ZODIAC[getZodiacIndex(y1)],
        zodiac2: ZODIAC[getZodiacIndex(y2)],
        relation: getRelation(wx1, wx2),
        name1: a.name.trim() || '첫 번째 분',
        name2: b.name.trim() || '두 번째 분',
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* 배경 클로버 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {CLOVERS.map((c) => (
          <img key={c.id} src="/clover-mark.svg" width={c.size} height={c.size} alt="" aria-hidden
            style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, opacity: 0.1,
              transform: `rotate(${c.rot}deg)`, animation: `lk-float ${c.dur}s ${c.delay}s ease-in-out infinite` }} />
        ))}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 300, height: 300,
          borderRadius: '64% 36% 58% 42% / 54% 48% 52% 46%',
          background: 'radial-gradient(circle at 30% 30%, rgba(111,207,123,0.28), rgba(111,207,123,0) 70%)',
          filter: 'blur(24px)', pointerEvents: 'none' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 560, margin: '0 auto', padding: '48px 16px' }}>
        {/* 히어로 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>💕</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 6vw, 34px)', fontWeight: 700,
            color: 'var(--fg-brand)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            우리 궁합 보기
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>
            두 사람의 생년월일로 오행 상성을 확인해요<br />
            <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>※ 재미로만 즐겨주세요</span>
          </p>
        </motion.div>

        {/* 입력 폼 */}
        <motion.form onSubmit={handleCheck} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--radius-blob)',
            padding: 20, boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--fg-brand)',
            margin: 0, textAlign: 'center', fontWeight: 700 }}>
            두 분의 정보를 입력해주세요 ✨
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: '첫 번째', state: a, setState: setA, color: 'var(--green-500)' },
              { label: '두 번째', state: b, setState: setB, color: '#6B4C00' },
            ].map(({ label, state, setState, color }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-sans)',
                  textAlign: 'center', padding: '4px 0' }}>{label}</div>
                <input type="text" value={state.name} placeholder="이름 (선택)"
                  maxLength={20} onChange={(e) => setState(s => ({ ...s, name: e.target.value }))}
                  style={inputStyle} />
                <input type="text" inputMode="numeric" value={state.birthday}
                  placeholder="20000105" maxLength={8}
                  onChange={(e) => setState(s => ({ ...s, birthday: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                  style={inputStyle} />
                <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
                  예: 20000105
                </div>
              </div>
            ))}
          </div>

          {error && <p style={{ color: '#B04040', fontSize: 12, margin: 0, textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={isLoading}
            style={{ width: '100%', border: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700,
              fontSize: 16, padding: '14px 22px', borderRadius: 999,
              background: isLoading ? 'var(--green-300)' : 'var(--green-400)', color: '#0A2416',
              cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1,
              transition: 'background 150ms' }}>
            {isLoading ? '궁합 보는 중...' : '궁합 보기 💕'}
          </button>
        </motion.form>

        {/* 결과 카드 */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ marginTop: 24 }}>
              <CompatCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontSize: 13,
  color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--line)',
  borderRadius: 'var(--radius-md)', padding: '10px 12px', outline: 'none',
};

function CompatCard({ result }: { result: CompatResult }) {
  const info = COMPAT_INFO[result.relation];
  const b1 = WUXING_BADGE[result.wx1];
  const b2 = WUXING_BADGE[result.wx2];

  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '28px 34px 26px 30px',
      boxShadow: 'var(--shadow-md)', padding: 22, position: 'relative', overflow: 'hidden' }}>
      {/* ambient blob */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180,
        borderRadius: '64% 36% 58% 42% / 54% 48% 52% 46%',
        background: 'radial-gradient(circle at 30% 30%, rgba(111,207,123,0.4), rgba(111,207,123,0) 70%)',
        filter: 'blur(16px)', pointerEvents: 'none' }} />

      {/* 점수 */}
      <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative' }}>
        <div style={{ fontSize: 48, fontFamily: 'var(--font-display)', fontWeight: 700,
          color: info.score >= 80 ? 'var(--green-500)' : info.score >= 70 ? 'var(--green-400)' : 'var(--sage-500)' }}>
          {info.score}%
        </div>
        <div style={{ fontSize: 14, marginTop: 4 }}>
          {'♥'.repeat(info.hearts)}{'♡'.repeat(5 - info.hearts)}
        </div>
      </div>

      {/* 두 사람 오행 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
        <PersonBadge name={result.name1} stem={result.stem1} wx={result.wx1} zodiac={result.zodiac1} badge={b1} />
        <div style={{ fontSize: 20, color: 'var(--ink-mute)', flexShrink: 0 }}>↔</div>
        <PersonBadge name={result.name2} stem={result.stem2} wx={result.wx2} zodiac={result.zodiac2} badge={b2} />
      </div>

      <div style={{ height: 1, background: 'var(--line)', margin: '0 0 14px' }} />

      {/* 관계 설명 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
          color: 'var(--fg-brand)', marginBottom: 8 }}>
          {info.title}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.7,
          color: 'var(--ink-soft)', margin: 0 }}>
          {info.desc}
        </p>
      </div>
    </div>
  );
}

function PersonBadge({ name, stem, wx, zodiac, badge }: {
  name: string; stem: string; wx: WuXing;
  zodiac: { name: string; emoji: string };
  badge: { bg: string; fg: string };
}) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-sans)', marginBottom: 6 }}>{name}</div>
      <div style={{ background: badge.bg, color: badge.fg, borderRadius: 14,
        padding: '10px 12px', border: `1px solid ${badge.fg}22`, display: 'inline-block', minWidth: 90 }}>
        <div style={{ fontSize: 24, lineHeight: 1 }}>{WUXING_EMOJI[wx]}</div>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: 4 }}>
          {STEM_HANJA[stem]} {stem}
        </div>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-sans)', marginTop: 2, opacity: 0.8 }}>{wx}</div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-sans)', marginTop: 6 }}>
        {zodiac.emoji} {zodiac.name}띠
      </div>
    </div>
  );
}

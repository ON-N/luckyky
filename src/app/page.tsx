'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputForm from '@/components/Fortune/InputForm';
import FortuneCard from '@/components/Fortune/FortuneCard';
import GiscusBridge from '@/components/Comments/GiscusBridge';
import { useFortune } from '@/hooks/useFortune';
import { FortuneInput } from '@/types';

type PageState = 'idle' | 'loading' | 'done';

// 떠다니는 클로버 파티클 — 고정 seed로 SSR hydration 불일치 방지
const CLOVERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 97,
  y: (i * 53 + 7)  % 93,
  size: 10 + (i * 7) % 14,
  delay: (i * 0.4) % 3,
  dur:   6 + (i * 0.6) % 6,
  rot:   (i * 47) % 360,
}));

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [input, setInput] = useState<FortuneInput | null>(null);
  const { fortune, isLoading } = useFortune(input);
  const mounted = useRef(false);

  useEffect(() => { mounted.current = true; }, []);

  useEffect(() => {
    if (!isLoading && pageState === 'loading') setPageState('done');
  }, [isLoading, pageState]);

  const handleSubmit = (formInput: FortuneInput) => {
    setInput(formInput);
    setPageState('loading');
  };

  const displayName = input
    ? input.inputType === 'name' ? input.name : input.birthday
    : '';

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* 클로버 배경 패턴 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {CLOVERS.map((c) => (
          <img
            key={c.id}
            src="/clover-mark.svg"
            width={c.size}
            height={c.size}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              opacity: 0.12,
              transform: `rotate(${c.rot}deg)`,
              animation: `lk-float ${c.dur}s ${c.delay}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* ambient blob — 우상단 */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 320, height: 320,
          borderRadius: '64% 36% 58% 42% / 54% 48% 52% 46%',
          background: 'radial-gradient(circle at 30% 30%, rgba(111,207,123,0.32), rgba(111,207,123,0) 70%)',
          filter: 'blur(24px)', pointerEvents: 'none',
        }} />
        {/* ambient blob — 좌하단 */}
        <div style={{
          position: 'absolute', bottom: -60, left: -40,
          width: 280, height: 280,
          borderRadius: '40% 60% 44% 56% / 50% 44% 56% 50%',
          background: 'radial-gradient(circle at 70% 70%, rgba(52,199,89,0.2), rgba(52,199,89,0) 70%)',
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />
      </div>

      {/* 콘텐츠 */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 560,
        margin: '0 auto',
        padding: '48px 16px 48px',
      }}>
        {/* 히어로 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}
        >
          <div style={{ fontSize: 44, marginBottom: 6 }}>🔮</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 6vw, 36px)',
            fontWeight: 700,
            color: 'var(--fg-brand)',
            margin: '0 0 8px',
            letterSpacing: '-0.01em',
          }}>
            오늘의 운세
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--ink-soft)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            이름이나 생년월일을 입력하면<br />오늘 하루의 운세를 알려드릴게요
          </p>
        </motion.div>

        {/* 입력 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginBottom: 24 }}
        >
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>

        {/* 운세 카드 */}
        <AnimatePresence>
          {(pageState === 'loading' || pageState === 'done') && fortune && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: 24 }}
            >
              <FortuneCard fortune={fortune} userName={displayName} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 댓글 */}
        <AnimatePresence>
          {pageState === 'done' && (
            <motion.div
              key="comments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GiscusBridge />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputForm from '@/components/Fortune/InputForm';
import FortuneCard from '@/components/Fortune/FortuneCard';
import GiscusBridge from '@/components/Comments/GiscusBridge';
import { useFortune } from '@/hooks/useFortune';
import { FortuneInput } from '@/types';

type PageState = 'idle' | 'loading' | 'done';

const STAR_COUNT = 20;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  size: Math.floor(Math.random() * 3) + 1,
  delay: Math.floor(Math.random() * 30) / 10,
  duration: Math.floor(Math.random() * 20) / 10 + 2,
}));

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [input, setInput] = useState<FortuneInput | null>(null);
  const { fortune, isLoading } = useFortune(input);

  useEffect(() => {
    if (!isLoading && pageState === 'loading') {
      setPageState('done');
    }
  }, [isLoading, pageState]);

  const handleSubmit = (formInput: FortuneInput) => {
    setInput(formInput);
    setPageState('loading');
  };

  const displayName = input
    ? input.inputType === 'name'
      ? input.name
      : input.birthday
    : '';

  return (
    <div className="relative min-h-screen bg-[#0D0520] overflow-hidden">
      {/* 별 파티클 배경 */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-yellow-200"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-yellow-300 mb-2">
              🔮 오늘의 운세
            </h1>
            <p className="text-purple-300 text-sm">
              이름 또는 생년월일을 입력하면 오늘 하루의 운세를 알려드립니다
            </p>
          </motion.div>
        </div>

        {/* 입력 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>

        {/* 운세 카드 */}
        <AnimatePresence>
          {(pageState === 'loading' || pageState === 'done') && fortune && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <FortuneCard fortune={fortune} userName={displayName} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Giscus 댓글 */}
        <AnimatePresence>
          {pageState === 'done' && (
            <motion.div
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

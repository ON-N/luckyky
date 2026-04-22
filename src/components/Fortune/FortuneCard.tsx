'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fortune } from '@/types';
import { GRADE_CONFIG } from '@/data/fortunes';

interface FortuneCardProps {
  fortune: Fortune;
  userName: string;
}

export default function FortuneCard({ fortune, userName }: FortuneCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const gradeConfig = GRADE_CONFIG[fortune.grade];

  useEffect(() => {
    setIsFlipped(false);
    const timer = setTimeout(() => setIsFlipped(true), 100);
    return () => clearTimeout(timer);
  }, [fortune]);

  const handleShare = async () => {
    const displayName = userName || '나';
    const shareText = `[우리들의 운세 아지트]\n오늘 ${displayName}의 운세: ${fortune.grade}\n\n${fortune.title}\n${fortune.body}\n\n🍀 행운 아이템: ${fortune.luckyItem}\n🎨 행운 색상: ${fortune.luckyColor}\n🍽️ 행운 음식: ${fortune.luckyFood}\n🔢 행운 숫자: ${fortune.luckyNumber}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
      <div className="relative w-full" style={{ minHeight: '480px' }}>
        {/* 카드 앞면 (초기) */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-950 border border-yellow-500/30 rounded-2xl flex flex-col items-center justify-center p-8 shadow-2xl">
            <div className="text-6xl mb-4 animate-pulse">🔮</div>
            <p className="text-purple-300 text-lg font-medium">운세를 불러오는 중...</p>
            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-yellow-400"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 카드 뒷면 (운세 결과) */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial={{ rotateY: -180 }}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`w-full h-full border rounded-2xl p-6 shadow-2xl backdrop-blur-sm ${gradeConfig.bgColor} ${gradeConfig.borderColor} bg-purple-900/80`}>
            {/* 등급 배지 */}
            <div className="flex justify-center mb-4">
              {fortune.grade === '대길' ? (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${gradeConfig.borderColor} bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-[length:200%_100%] animate-shimmer text-purple-950`}>
                  {fortune.grade} {gradeConfig.emoji}
                </span>
              ) : (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${gradeConfig.borderColor} ${gradeConfig.bgColor} ${gradeConfig.textColor}`}>
                  {fortune.grade} {gradeConfig.emoji}
                </span>
              )}
            </div>

            {/* 제목 */}
            <h3 className={`text-center text-xl font-bold mb-3 ${gradeConfig.textColor}`}>
              {fortune.title}
            </h3>

            <div className="border-t border-purple-600/30 my-3" />

            {/* 본문 */}
            <p className="text-purple-100 text-sm leading-relaxed mb-4 text-center">
              {fortune.body}
            </p>

            <div className="border-t border-purple-600/30 my-3" />

            {/* 행운 정보 */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">🍀</div>
                <div className="text-purple-400 text-xs mb-1">행운 아이템</div>
                <div className="text-white text-sm font-medium">{fortune.luckyItem}</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">🎨</div>
                <div className="text-purple-400 text-xs mb-1">행운 색상</div>
                <div className="text-white text-sm font-medium">{fortune.luckyColor}</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">🍽️</div>
                <div className="text-purple-400 text-xs mb-1">행운 음식</div>
                <div className="text-white text-sm font-medium">{fortune.luckyFood}</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">🔢</div>
                <div className="text-purple-400 text-xs mb-1">행운 숫자</div>
                <div className={`text-xl font-bold ${gradeConfig.textColor}`}>{fortune.luckyNumber}</div>
              </div>
            </div>

            {/* 공유 버튼 */}
            <button
              onClick={handleShare}
              className="w-full bg-purple-800/60 hover:bg-purple-700/70 border border-purple-500/50 text-purple-200 hover:text-white rounded-xl py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>복사됐어요!</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>운세 공유하기</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

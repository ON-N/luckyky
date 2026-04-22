'use client';

import { useState } from 'react';
import { FortuneInput } from '@/types';

interface InputFormProps {
  onSubmit: (input: FortuneInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [inputType, setInputType] = useState<'name' | 'birthday'>('name');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (inputType === 'name') {
      if (!name.trim()) {
        setError('이름을 입력해주세요.');
        return;
      }
    } else {
      if (!birthday) {
        setError('생년월일을 입력해주세요.');
        return;
      }
      const birthDate = new Date(birthday);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        setError('올바른 생년월일을 입력해주세요.');
        return;
      }
    }

    onSubmit({ name, birthday, inputType });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-purple-900/60 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-purple-900/50">
        <h2 className="text-center text-yellow-300 text-lg font-semibold mb-5">
          오늘의 운세를 확인하세요
        </h2>

        {/* 입력 방식 토글 */}
        <div className="flex rounded-xl overflow-hidden border border-purple-600/50 mb-5">
          <button
            type="button"
            onClick={() => { setInputType('name'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              inputType === 'name'
                ? 'bg-purple-600 text-yellow-300'
                : 'bg-purple-950/50 text-purple-300 hover:bg-purple-800/50'
            }`}
          >
            이름으로 보기
          </button>
          <button
            type="button"
            onClick={() => { setInputType('birthday'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              inputType === 'birthday'
                ? 'bg-purple-600 text-yellow-300'
                : 'bg-purple-950/50 text-purple-300 hover:bg-purple-800/50'
            }`}
          >
            생년월일로 보기
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputType === 'name' ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              maxLength={20}
              className="w-full bg-purple-950/70 border border-purple-600/50 text-white placeholder-purple-400 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/70 focus:ring-1 focus:ring-yellow-500/30 transition-colors"
            />
          ) : (
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-purple-950/70 border border-purple-600/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500/70 focus:ring-1 focus:ring-yellow-500/30 transition-colors [color-scheme:dark]"
            />
          )}

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-purple-950 font-bold rounded-xl px-4 py-3 transition-all duration-200 shadow-lg shadow-yellow-900/30 text-base"
          >
            {isLoading ? '운세 보는 중...' : '운세 보기 ✨'}
          </button>
        </form>
      </div>
    </div>
  );
}

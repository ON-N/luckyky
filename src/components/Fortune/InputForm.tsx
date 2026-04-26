'use client';

import { useState } from 'react';
import { FortuneInput } from '@/types';

interface InputFormProps {
  onSubmit: (input: FortuneInput) => void;
  isLoading: boolean;
}

function parseBirthday(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');
  const [nameFocus, setNameFocus] = useState(false);
  const [bdFocus, setBdFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() && !birthday) {
      setError('이름 또는 생년월일을 입력해주세요.');
      return;
    }
    if (birthday) {
      const parsed = parseBirthday(birthday);
      if (!parsed) {
        setError('생년월일 8자리를 입력해주세요 (예: 20000105)');
        return;
      }
      const d = new Date(parsed);
      if (isNaN(d.getTime()) || d > new Date()) {
        setError('올바른 생년월일을 입력해주세요.');
        return;
      }
      onSubmit({ name, birthday: parsed });
      return;
    }
    onSubmit({ name, birthday: '' });
  };

  const inputBase = (focused: boolean, hasError: boolean): React.CSSProperties => ({
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    color: 'var(--ink)',
    background: '#fff',
    border: `1.5px solid ${hasError ? '#D68A8A' : focused ? 'var(--green-400)' : 'var(--line)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '14px 18px',
    boxShadow: focused
      ? 'var(--shadow-inset), 0 0 0 4px rgba(111,207,123,0.18)'
      : 'var(--shadow-inset)',
    outline: 'none',
    transition: 'border-color 150ms, box-shadow 150ms',
  });

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-blob)',
      padding: 20,
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        color: 'var(--fg-brand)',
        margin: 0,
        textAlign: 'center',
        fontWeight: 700,
      }}>
        오늘의 운세를 확인하세요 ✨
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 (선택)"
            maxLength={20}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            style={inputBase(nameFocus, false)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
              생년월일 입력 시 오행 분석
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="20000105"
            maxLength={8}
            onFocus={() => setBdFocus(true)}
            onBlur={() => setBdFocus(false)}
            style={inputBase(bdFocus, false)}
          />
          <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
            예: 20000105 = 2000년 01월 05일
          </div>
        </div>

        {error && (
          <p style={{ color: '#B04040', fontSize: 12, margin: '0 0 0 8px' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => { setHover(false); setPress(false); }}
          onMouseDown={() => setPress(true)}
          onMouseUp={() => setPress(false)}
          style={{
            width: '100%',
            border: 'none',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 16,
            padding: '14px 22px',
            borderRadius: 999,
            background: isLoading ? 'var(--green-300)' : hover ? 'var(--green-500)' : 'var(--green-400)',
            color: '#0A2416',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transform: press ? 'scale(0.97)' : hover ? 'translateY(-2px) scale(1.02)' : 'none',
            boxShadow: press ? 'var(--shadow-sm)' : hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            transition: `transform 150ms var(--ease-jelly), background 150ms, box-shadow 150ms`,
          }}
        >
          {isLoading ? '운세 보는 중...' : '운세 보기 ✨'}
        </button>
      </form>
    </div>
  );
}

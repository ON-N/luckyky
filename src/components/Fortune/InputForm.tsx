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
  const [nameFocus, setNameFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (inputType === 'name') {
      if (!name.trim()) { setError('이름을 입력해주세요.'); return; }
    } else {
      if (!birthday) { setError('생년월일을 입력해주세요.'); return; }
      const d = new Date(birthday);
      if (isNaN(d.getTime()) || d > new Date()) {
        setError('올바른 생년월일을 입력해주세요.'); return;
      }
    }
    onSubmit({ name, birthday, inputType });
  };

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

      {/* 토글 */}
      <div style={{
        display: 'inline-flex',
        width: '100%',
        background: 'var(--green-100)',
        borderRadius: 999,
        padding: 4,
        border: '1px solid var(--line)',
        boxSizing: 'border-box',
      }}>
        {(['name', 'birthday'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => { setInputType(k); setError(''); }}
            style={{
              flex: 1,
              border: 'none',
              background: inputType === k ? '#fff' : 'transparent',
              color: inputType === k ? 'var(--fg-brand)' : 'var(--ink-soft)',
              padding: '10px 0',
              borderRadius: 999,
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: inputType === k ? 'var(--shadow-sm)' : 'none',
              transition: `all 180ms var(--ease-jelly)`,
            }}
          >
            {k === 'name' ? '이름으로 보기' : '생년월일로 보기'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {inputType === 'name' ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={20}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              color: 'var(--ink)',
              background: '#fff',
              border: `1.5px solid ${error ? '#D68A8A' : nameFocus ? 'var(--green-400)' : 'var(--line)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              boxShadow: nameFocus
                ? 'var(--shadow-inset), 0 0 0 4px rgba(111,207,123,0.18)'
                : 'var(--shadow-inset)',
              outline: 'none',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
          />
        ) : (
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              color: 'var(--ink)',
              background: '#fff',
              border: `1.5px solid ${error ? '#D68A8A' : 'var(--line)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-inset)',
              outline: 'none',
              colorScheme: 'light',
            }}
          />
        )}

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

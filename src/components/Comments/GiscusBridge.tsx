'use client';

import { useEffect, useRef } from 'react';

const APP_ID = '75166442-887b-47b4-9e69-b0b58441455b';

export default function GiscusBridge() {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threadRef.current) return;

    threadRef.current.setAttribute('data-host', 'https://cusdis.com');
    threadRef.current.setAttribute('data-app-id', APP_ID);
    threadRef.current.setAttribute('data-page-id', 'main');
    threadRef.current.setAttribute('data-page-url', window.location.href);
    threadRef.current.setAttribute('data-page-title', '우리들의 운세 아지트');

    const existing = document.querySelector('script[src="https://cusdis.com/js/cusdis.es.js"]');
    if (existing) {
      // 이미 로드된 경우 렌더 함수 재호출
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).CUSDIS?.renderTo(threadRef.current);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cusdis.com/js/cusdis.es.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="border-t border-purple-700/40 pt-6 mb-4">
        <h3 className="text-purple-300 text-center text-sm font-medium mb-1">
          💬 친구들의 반응
        </h3>
        <p className="text-purple-500 text-center text-xs">
          로그인 없이 댓글을 남길 수 있어요!
        </p>
      </div>
      <div id="cusdis_thread" ref={threadRef} />
    </div>
  );
}

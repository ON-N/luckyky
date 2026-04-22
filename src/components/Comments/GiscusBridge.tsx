'use client';

import { useEffect, useRef } from 'react';

export default function GiscusBridge() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? '';
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '';
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General';
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '';

    if (!repo || !repoId || !categoryId) {
      // Giscus 미설정 상태: 안내 메시지 표시
      const placeholder = document.createElement('div');
      placeholder.className = 'text-center text-purple-400 text-sm py-8';
      placeholder.textContent = '💬 댓글 기능을 활성화하려면 Giscus를 설정해주세요.';
      ref.current.appendChild(placeholder);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark_dimmed');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="border-t border-purple-700/40 pt-6 mb-4">
        <h3 className="text-purple-300 text-center text-sm font-medium mb-1">
          💬 친구들의 반응
        </h3>
        <p className="text-purple-500 text-center text-xs">
          오늘 운세 어때요? 댓글로 알려주세요!
        </p>
      </div>
      <div ref={ref} className="giscus" />
    </div>
  );
}

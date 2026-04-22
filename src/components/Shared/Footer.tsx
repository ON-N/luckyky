export default function Footer() {
  return (
    <footer style={{
      background: 'var(--green-100)',
      borderTop: '1px solid var(--line)',
      padding: '22px 16px',
      marginTop: 32,
      textAlign: 'center',
    }}>
      <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 13, fontFamily: 'var(--font-sans)' }}>
        매일 새로운 운세를 확인하세요 ✨
      </p>
      <p style={{ margin: '6px 0 0', color: 'var(--ink-mute)', fontSize: 11, fontFamily: 'var(--font-sans)' }}>
        © 2026 우리들의 운세 아지트 · 재미로만 즐겨주세요
      </p>
    </footer>
  );
}

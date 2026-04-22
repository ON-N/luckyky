import Image from 'next/image';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      background: 'rgba(255,255,255,0.78)',
      backdropFilter: 'blur(12px) saturate(1.1)',
      WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        maxWidth: 560,
        margin: '0 auto',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <Image
            src="/clover-mark.svg"
            width={24}
            height={24}
            alt=""
            aria-hidden
            style={{ flexShrink: 0 }}
          />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--fg-brand)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            우리들의 운세 아지트
          </span>
        </div>
        <span style={{
          fontSize: 11,
          color: 'var(--ink-mute)',
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          매일 새로운 운세
        </span>
      </div>
    </nav>
  );
}

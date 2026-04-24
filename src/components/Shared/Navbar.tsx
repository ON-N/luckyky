import Image from 'next/image';
import Link from 'next/link';

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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1, textDecoration: 'none' }}>
          <Image src="/clover-mark.svg" width={24} height={24} alt="" aria-hidden style={{ flexShrink: 0 }} />
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
        </Link>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <NavLink href="/" label="운세" />
          <NavLink href="/compatibility" label="💕 궁합" />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        color: 'var(--fg-brand)',
        textDecoration: 'none',
        padding: '5px 12px',
        borderRadius: 999,
        border: '1px solid var(--line)',
        background: 'var(--green-50)',
        whiteSpace: 'nowrap',
        transition: 'background 150ms',
      }}
    >
      {label}
    </Link>
  );
}

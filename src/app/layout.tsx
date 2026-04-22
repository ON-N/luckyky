import type { Metadata } from 'next';
import { Gaegu, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Shared/Navbar';
import Footer from '@/components/Shared/Footer';

const gaegu = Gaegu({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '우리들의 운세 아지트 🍀',
  description: '매일 새로운 운세로 하루를 시작하세요. 이름이나 생년월일로 오늘의 운세를 확인해보세요.',
  openGraph: {
    title: '우리들의 운세 아지트 🍀',
    description: '오늘 나의 운세는? 친구들과 함께 확인해보세요!',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gaegu.variable} ${notoSansKR.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: 'var(--font-sans)', background: 'var(--bg)', color: 'var(--fg)' }}
      >
        <Navbar />
        <main className="flex-1 pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

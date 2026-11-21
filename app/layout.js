import { Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  title: 'Mridul Sharma — Cyber Security',
  description:
    'Mridul Sharma — B.Tech CSE (Cyber Security) student at Central University of Jammu. Network security, IoT and applied machine learning.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="loading">{children}</body>
    </html>
  );
}

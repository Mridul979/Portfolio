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

// Without JavaScript the preloader never lifts and reveals never fire, so show the content directly.
const noJsStyles = `
  body.loading{overflow:auto}
  body.loading .nav{translate:0 0}
  .loader,.cursor,.cursor-dot{display:none}
  .reveal,.intro-fade,.exp.stagger *,.project__visual,.project li,.project .chip,.about__lead .w{opacity:1!important;transform:none!important;filter:none!important}
  .sl__in,.hero__title .char,.footer-name .char{transform:none!important}
  .hero__title .pill-img{clip-path:none!important}
  .project__body{grid-template-rows:1fr!important}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="loading">
        <noscript><style>{noJsStyles}</style></noscript>
        {children}
      </body>
    </html>
  );
}

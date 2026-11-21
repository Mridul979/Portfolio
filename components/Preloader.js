'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/data/content';
import { Chars } from './Split';

// Eased 0 → 100 count with a progress line, then a two-layer curtain wipe
// (dark panel lifts first, a lime panel chases it) and tells the page it's ready.
export default function Preloader() {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('in'); // in → done

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = reduce ? 1 : 1500;
    const t0 = performance.now();
    let raf, finishTimer;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      // ease-in-out with a small "hesitation" in the middle so it feels like real loading
      const k = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setCount(Math.round(k * 100));
      if (p < 1) { raf = requestAnimationFrame(step); return; }
      finishTimer = setTimeout(() => {
        setPhase('done');
        document.body.classList.remove('loading');
        document.body.classList.add('ready');
        window.dispatchEvent(new Event('app-ready'));
      }, reduce ? 0 : 200);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearTimeout(finishTimer); };
  }, []);

  return (
    <div className={`loader${phase === 'done' ? ' done' : ''}`} aria-hidden="true">
      <div className="loader__panel loader__panel--accent" />
      <div className="loader__panel loader__panel--dark">
        <div className="loader__top">
          <span className="loader__name"><Chars text={profile.name} /></span>
          <span className="loader__tag">Portfolio ©{new Date().getFullYear()}</span>
        </div>
        <div className="loader__bottom">
          <span className="loader__msg">{count < 40 ? 'Initialising' : count < 80 ? 'Encrypting payload' : 'Access granted'}</span>
          <div className="loader__count"><span>{String(count).padStart(3, '0')}</span>%</div>
        </div>
        <div className="loader__bar" style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </div>
  );
}

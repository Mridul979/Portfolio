'use client';

import { useEffect, useRef } from 'react';
import { aboutText, stats, education } from '@/data/content';
import Icon from './Icon';
import { SplitLines } from './Split';

// Splits text into word spans so they can light up one by one while scrolling.
function Words({ text }) {
  return text.split(/(\s+)/).map((w, i) => (w.trim() ? <span className="w" key={i}>{w}</span> : w));
}

export default function About() {
  const textRef = useRef(null);
  const statsRef = useRef(null);

  // Scroll-highlighted paragraph
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = textRef.current;
    const words = [...st.querySelectorAll('.w')];
    const onScroll = () => {
      const r = st.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const lit = reduce ? words.length : Math.floor(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  // Count-up numbers
  useEffect(() => {
    const counters = [...statsRef.current.querySelectorAll('[data-count]')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach((el) => { el.textContent = el.dataset.count; });
      return;
    }
    const frames = new Map();
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, start = end > 1000 ? 2000 : 0, dur = 1400, t0 = performance.now();
      const step = (t) => {
        const p = Math.max(0, Math.min(1, (t - t0) / dur)), k = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (end - start) * k);
        if (p < 1) frames.set(el, requestAnimationFrame(step));
      };
      frames.set(el, requestAnimationFrame(step));
      io.unobserve(el);
    }), { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      frames.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <section className="pad" id="about">
      <div className="wrap">
        <div className="about__grid">
          <div data-speed="-0.08">
            <span className="eyebrow reveal">About me</span>
            <SplitLines className="h2" style={{ marginTop: 20 }} lines={['Disciplined.', { em: 'Curious.' }, 'Security‑first.']} />
          </div>
          <p className="about__lead" ref={textRef}>
            {aboutText.map((seg, i) =>
              seg.mark ? <mark key={i}><Words text={seg.text} /></mark> : <Words key={i} text={seg.text} />
            )}
          </p>
        </div>

        <div className="stats" ref={statsRef}>
          {stats.map((s) => (
            <div className="stat reveal" key={s.label}>
              <div className="stat__num"><span data-count={s.value}>0</span>{s.suffix}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="edu reveal">
          <div className="edu__icon"><Icon name="grad" size={28} stroke={2} /></div>
          <div>
            <h3>{education.school}</h3>
            <p>{education.degree}</p>
          </div>
          <span className="chip">{education.years}</span>
        </div>
      </div>
    </section>
  );
}

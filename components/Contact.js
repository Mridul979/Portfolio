'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/content';
import Icon from './Icon';
import { Chars } from './Split';
import useYear from './useYear';

export default function Contact() {
  const [toast, setToast] = useState(false);
  const [clock, setClock] = useState('');
  const toastTimer = useRef(null);
  const year = useYear();

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit',
    }) + ' IST');
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); }
    catch { location.href = `mailto:${profile.email}`; return; }
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2200);
  };

  const toTop = () => {
    if (window.__lenis) { window.__lenis.scrollTo(0, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) }); return; }
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section className="contact" id="contact" data-expand>
      <div className="wrap">
        <span className="eyebrow reveal">Got an opportunity?</span>
        <h2 className="contact__big split-reveal" data-repel data-strength="1.3">
          <a href={`mailto:${profile.email}`} data-hover aria-label="Let's work together">
            <span className="sl" aria-hidden="true"><span className="sl__in" style={{ '--i': 0 }}><Chars text="Let's work" /></span></span>
            <span className="sl" aria-hidden="true">
              <span className="sl__in" style={{ '--i': 1 }}>
                <span><Chars text="together" /></span>{' '}
                <span className="circle">
                  <svg width=".45em" height=".45em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                </span>
              </span>
            </span>
          </a>
        </h2>

        <div className="contact__grid">
          <button className="contact-card reveal" onClick={copyEmail}>
            <div><small>Email · click to copy</small><span>{profile.email}</span></div>
            <Icon name="copy" size={22} stroke={2} />
          </button>
          <a className="contact-card reveal" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <div><small>LinkedIn</small><span>{profile.linkedinHandle}</span></div>
            <Icon name="arrowUpRight" size={22} />
          </a>
          <div className="contact-card reveal">
            <div><small>Based in</small><span>{profile.location}</span></div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 14, opacity: 0.7 }}>{clock}</span>
          </div>
        </div>

        <div className="footer-name stagger" aria-hidden="true" data-repel data-strength="1.6"><Chars text={profile.name} /></div>

        <footer className="footer">
          <span>© {year} {profile.name}. Designed &amp; built with care.</span>
          <button className="to-top" onClick={toTop}>Back to top ↑</button>
        </footer>
      </div>

      <div className={`copy-toast${toast ? ' show' : ''}`} role="status">Email copied to clipboard ✓</div>
    </section>
  );
}

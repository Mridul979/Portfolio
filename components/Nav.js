'use client';

import { useEffect, useRef, useState } from 'react';
import { navLinks, profile } from '@/data/content';
import { Roll } from './Split';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState(-1);
  const progressRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    let lastY = 0;
    const sections = navLinks.map((l) => document.querySelector(l.href));
    const onScroll = () => {
      const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
      if (progressRef.current) progressRef.current.style.width = `${h > 0 ? Math.min(100, (y / h) * 100) : 0}%`;
      if (!openRef.current) setHidden(y > lastY && y > 300);
      lastY = y;
      let cur = -1;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
      setActive(cur);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  // While the mobile menu is open: lock page scroll, close on Escape, and close if the
  // window grows past the breakpoint where the burger button disappears.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const desktop = matchMedia('(min-width: 861px)');
    const close = () => setOpen(false);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onChange = (e) => { if (e.matches) close(); };
    root.classList.add('menu-lock');
    window.__lenis?.stop();
    addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      root.classList.remove('menu-lock');
      window.__lenis?.start();
      removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [open]);

  return (
    <div className={open ? 'menu-open' : ''}>
      <div className="progress" ref={progressRef} />
      <header className={`nav${hidden ? ' hide' : ''}`}>
        <a href="#top" className="logo"><i />{profile.shortName}</a>
        <ul className="nav__links">
          {navLinks.map((l, i) => (
            <li key={l.href}><a href={l.href} className={i === active ? 'active' : ''}><Roll>{l.label}</Roll></a></li>
          ))}
        </ul>
        <a href="#contact" className="btn magnetic"><Roll>Let&apos;s talk</Roll> <span className="arrow">→</span></a>
        <button className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </header>
      <nav className="mobile-menu" aria-label="Mobile" aria-hidden={!open}>
        {[...navLinks.filter((l) => l.href !== '#certifications'), { href: '#contact', label: 'Contact' }].map((l, i) => (
          <a key={l.href} href={l.href} style={{ '--i': i }} tabIndex={open ? 0 : -1} onClick={() => { window.__lenis?.start(); setOpen(false); }}><span>{l.label}</span></a>
        ))}
        <small>{profile.location}</small>
      </nav>
    </div>
  );
}

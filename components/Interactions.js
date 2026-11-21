'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;

// Page-wide motion system. One requestAnimationFrame loop drives:
// smooth scroll (Lenis), velocity-reactive marquee, parallax, hero scroll-out,
// stacking cards, expanding dark sections, mouse-depth hero layers and the cursor.
// Scroll reveals, magnetic buttons and tilt cards are event driven.
export default function Interactions() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(pointer: fine)').matches;
    const cleanups = [];
    const on = (el, ev, fn, opts) => { el.addEventListener(ev, fn, opts); cleanups.push(() => el.removeEventListener(ev, fn, opts)); };
    const $$ = (s) => [...document.querySelectorAll(s)];

    // ---------- Scroll reveals (staggered per batch) ----------
    const io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.classList.contains('reveal')) {
          el.style.transitionDelay = `${Math.min(n++, 5) * 90}ms`;
          // drop the stagger once revealed so hover effects respond instantly
          setTimeout(() => { el.style.transitionDelay = ''; }, 1700);
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .split-reveal, .stagger').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    if (reduce) {
      $$('.reveal, .split-reveal, .stagger').forEach((el) => el.classList.add('in'));
      return () => cleanups.forEach((fn) => fn());
    }

    // ---------- Smooth scroll ----------
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    if (!document.body.classList.contains('ready')) {
      lenis.stop();
      on(window, 'app-ready', () => lenis.start(), { once: true });
    }
    on(document, 'click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = id === '#top' || id === '#' ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });
    cleanups.push(() => { lenis.destroy(); delete window.__lenis; });

    // ---------- Elements driven by the frame loop ----------
    const marquees = $$('.marquee').map((el) => ({
      el, track: el.querySelector('.marquee__track'), x: 0, dir: -1, skew: 0,
    }));
    marquees.forEach((m) => m.el.classList.add('is-js'));
    const parallax = $$('[data-speed]').map((el) => ({ el, speed: parseFloat(el.dataset.speed) }));
    const expanders = $$('[data-expand]');
    const stacks = $$('.exp__list').map((list) => [...list.querySelectorAll('.exp')]);
    const heroTitle = document.querySelector('.hero__title');
    const depth = $$('[data-depth]').map((el) => ({ el, d: parseFloat(el.dataset.depth), x: 0, y: 0 }));
    const stackOn = matchMedia('(min-width: 761px)');

    // ---------- Letter repel: chars get pushed away from the cursor, then spring back ----------
    // Positions are cached relative to the container (offsetLeft/Top ignore transforms,
    // so our own displacement never feeds back into the measurement).
    const repel = fine ? $$('[data-repel]').map((box) => ({
      box,
      strength: parseFloat(box.dataset.strength || '1'),
      chars: [...box.querySelectorAll('.char')].map((el) => ({ el, ox: 0, oy: 0, w: 0, h: 0, x: 0, y: 0, vx: 0, vy: 0 })),
    })) : [];
    const measure = () => repel.forEach(({ box, chars }) => chars.forEach((c) => {
      let x = 0, y = 0, n = c.el;
      while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      if (n !== box) { // offsetParent chain skipped the box: fall back to rect delta
        const br = box.getBoundingClientRect(), cr = c.el.getBoundingClientRect();
        x = cr.left - br.left - c.x; y = cr.top - br.top - c.y;
      }
      c.ox = x; c.oy = y; c.w = c.el.offsetWidth; c.h = c.el.offsetHeight;
    }));
    measure();
    document.fonts?.ready.then(measure);
    on(window, 'resize', measure);

    // Unmask the lines once the entrance reveal has finished so pushed letters aren't clipped.
    const settle = (el, ms) => setTimeout(() => el.classList.add('settled'), ms);
    const settleObs = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      settle(e.target, 1700); settleObs.unobserve(e.target);
    }), { threshold: 0.15 });
    repel.forEach(({ box }) => {
      if (box.classList.contains('hero__title')) {
        const go = () => settle(box, 2600);
        if (document.body.classList.contains('ready')) go(); else on(window, 'app-ready', go, { once: true });
      } else settleObs.observe(box);
    });
    cleanups.push(() => settleObs.disconnect());

    let mx = innerWidth / 2, my = innerHeight / 2; // raw mouse
    let cx = mx, cy = my;                           // eased cursor ring
    let nx = 0, ny = 0;                             // normalised mouse -1..1
    let hovering = false;
    let morphed = false; // cursor is in hover/view state, so skip the stretch

    on(window, 'mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      nx = (mx / innerWidth) * 2 - 1; ny = (my / innerHeight) * 2 - 1;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    let raf;
    const frame = (t) => {
      lenis.raf(t);
      const v = lenis.velocity || 0;
      const vh = innerHeight;

      // Marquee: base drift + scroll velocity, flips with scroll direction, skews when fast.
      marquees.forEach((m) => {
        if (v > 0.1) m.dir = -1; else if (v < -0.1) m.dir = 1;
        const half = m.track.scrollWidth / 2;
        m.x += m.dir * (hovering && m.el.matches(':hover') ? 0.25 : 1.1 + Math.abs(v) * 0.9);
        if (m.x <= -half) m.x += half; else if (m.x > 0) m.x -= half;
        m.skew = lerp(m.skew, clamp(v * -0.6, -10, 10), 0.12);
        m.track.style.transform = `translate3d(${m.x}px,0,0) skewX(${m.skew}deg)`;
      });

      // Generic parallax relative to the viewport centre.
      parallax.forEach(({ el, speed }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * speed).toFixed(1)}px`;
      });

      // Hero title drifts up and fades as you leave the hero.
      if (heroTitle) {
        const y = lenis.scroll;
        if (y < vh * 1.2) {
          heroTitle.style.translate = `0 ${(y * -0.18).toFixed(1)}px`;
          heroTitle.style.opacity = clamp(1 - y / (vh * 0.9), 0, 1).toFixed(3);
        }
      }

      // Dark sections widen from an inset card to full bleed as they enter.
      expanders.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh * 0.75), 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.style.clipPath = `inset(0 ${((1 - e) * 5).toFixed(2)}% 0 ${((1 - e) * 5).toFixed(2)}% round ${(56 + (1 - e) * 24).toFixed(1)}px ${(56 + (1 - e) * 24).toFixed(1)}px 0 0)`;
      });

      // Stacking cards: each card shrinks and dims as the next one slides over it.
      stacks.forEach((cards) => cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next || !stackOn.matches) { card.style.scale = ''; card.style.filter = ''; return; }
        const a = card.getBoundingClientRect(), b = next.getBoundingClientRect();
        const p = clamp(1 - (b.top - a.top) / a.height, 0, 1);
        card.style.scale = (1 - p * 0.06).toFixed(4);
        card.style.filter = `brightness(${(1 - p * 0.25).toFixed(3)})`;
      }));

      // Letter repel (spring physics).
      repel.forEach(({ box, strength, chars }) => {
        const br = box.getBoundingClientRect();
        if (br.bottom < 0 || br.top > vh) return;
        const active = box.classList.contains('settled');
        chars.forEach((c) => {
          let tx = 0, ty = 0;
          if (active) {
            const R = Math.max(110, c.h * 1.5);
            const dx = br.left + c.ox + c.w / 2 + c.x - mx;
            const dy = br.top + c.oy + c.h / 2 + c.y - my;
            const d = Math.hypot(dx, dy);
            if (d < R && d > 0.01) {
              const f = Math.pow(1 - d / R, 2) * R * 0.38 * strength;
              tx = (dx / d) * f; ty = (dy / d) * f;
            }
          }
          c.vx = (c.vx + (tx - c.x) * 0.14) * 0.72;
          c.vy = (c.vy + (ty - c.y) * 0.14) * 0.72;
          c.x += c.vx; c.y += c.vy;
          if (Math.abs(c.x) < 0.05 && Math.abs(c.y) < 0.05 && !tx && !ty) {
            if (c.x || c.y) { c.x = c.y = c.vx = c.vy = 0; c.el.style.translate = ''; c.el.style.rotate = ''; }
            return;
          }
          c.el.style.translate = `${c.x.toFixed(2)}px ${c.y.toFixed(2)}px`;
          c.el.style.rotate = `${(c.x * 0.35).toFixed(2)}deg`;
        });
      });

      // Mouse-depth layers in the hero.
      depth.forEach((o) => {
        o.x = lerp(o.x, nx * o.d, 0.06); o.y = lerp(o.y, ny * o.d, 0.06);
        o.el.style.translate = `${o.x.toFixed(2)}px ${o.y.toFixed(2)}px`;
      });

      // Cursor ring.
      if (cursorRef.current) {
        cx = lerp(cx, mx, 0.18); cy = lerp(cy, my, 0.18);
        const sp = morphed ? 0 : Math.min(Math.hypot(mx - cx, my - cy) / 60, 0.5);
        const ang = morphed ? 0 : Math.atan2(my - cy, mx - cx) * 180 / Math.PI;
        cursorRef.current.style.transform =
          `translate(${cx}px,${cy}px) translate(-50%,-50%) rotate(${ang}deg) scale(${1 + sp},${1 - sp * 0.6})`;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    cleanups.push(() => cancelAnimationFrame(raf));

    if (fine) {
      const cur = cursorRef.current;
      on(document, 'mouseover', (e) => {
        const t = e.target.closest('a, button, [data-hover]');
        hovering = !!e.target.closest('.marquee');
        morphed = !!t;
        cur.classList.remove('is-hover', 'is-view');
        if (t) cur.classList.add(t.hasAttribute('data-view') ? 'is-view' : 'is-hover');
      });
      on(document, 'mouseleave', () => cur.classList.add('is-gone'));
      on(document, 'mouseenter', () => cur.classList.remove('is-gone'));
      on(document, 'mousedown', () => cur.classList.add('is-down'));
      on(document, 'mouseup', () => cur.classList.remove('is-down'));

      // Magnetic buttons (the label moves a little further than the button for depth).
      $$('.magnetic').forEach((el) => {
        const label = el.querySelector('.roll');
        on(el, 'mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
          el.style.transition = 'transform .2s ease-out';
          el.style.transform = `translate(${dx * 0.3}px,${dy * 0.4}px)`;
          if (label) label.style.translate = `${dx * 0.12}px ${dy * 0.15}px`;
        });
        on(el, 'mouseleave', () => {
          el.style.transition = 'transform .9s cubic-bezier(.16,1.4,.3,1)';
          el.style.transform = '';
          if (label) label.style.translate = '';
        });
      });

      // Tilt cards with glow.
      $$('.tilt').forEach((el) => {
        on(el, 'mousemove', (e) => {
          const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          el.style.setProperty('--mx', `${x}px`); el.style.setProperty('--my', `${y}px`);
          el.style.transition = 'transform .2s ease-out, border-color .4s';
          el.style.transform = `perspective(900px) rotateX(${(r.height / 2 - y) / 18}deg) rotateY(${(x - r.width / 2) / 18}deg) translateZ(0)`;
        });
        on(el, 'mouseleave', () => {
          el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1), border-color .4s';
          el.style.transform = ''; el.style.setProperty('--mx', '-999px');
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}

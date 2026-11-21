'use client';

import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/content';
import { visuals } from '@/data/visuals';
import Icon from './Icon';
import { SplitLines } from './Split';

export default function Work() {
  const [openIndex, setOpenIndex] = useState(0);
  const [preview, setPreview] = useState(null); // index of project shown in the floating preview
  const fpRef = useRef(null);
  const pos = useRef({ fx: 0, fy: 0, tx: 0, ty: 0 });

  // Smoothly move the floating preview toward the cursor
  useEffect(() => {
    if (preview === null) return;
    let raf;
    const follow = () => {
      const p = pos.current;
      p.fx += (p.tx - p.fx) * 0.14; p.fy += (p.ty - p.fy) * 0.14;
      if (fpRef.current) {
        fpRef.current.style.left = `${p.fx}px`; fpRef.current.style.top = `${p.fy}px`;
        // lean into the direction of travel
        fpRef.current.style.rotate = `${Math.max(-14, Math.min(14, (p.tx - p.fx) * 0.08)).toFixed(2)}deg`;
      }
      raf = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(raf);
  }, [preview]);

  const canPreview = () =>
    matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="work pad" id="work" data-expand>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Selected work</span>
            <SplitLines className="h2" style={{ marginTop: 20 }} lines={['Projects &', { em: 'experience' }]} />
          </div>
          <p className="reveal">Security tools, embedded systems and ML — click any row to open the details.</p>
        </div>

        <div className="projects">
          {projects.map((p, i) => {
            const open = openIndex === i;
            return (
              <article className={`project reveal${open ? ' open' : ''}`} key={p.no}>
                <button
                  className="project__head"
                  aria-expanded={open}
                  data-view
                  onClick={() => { setOpenIndex(open ? -1 : i); setPreview(null); }}
                  onMouseEnter={(e) => {
                    if (open || !canPreview()) return;
                    Object.assign(pos.current, { fx: e.clientX, fy: e.clientY, tx: e.clientX, ty: e.clientY });
                    setPreview(i);
                  }}
                  onMouseMove={(e) => { pos.current.tx = e.clientX + 60; pos.current.ty = e.clientY; }}
                  onMouseLeave={() => setPreview(null)}
                >
                  <span className="project__no">{p.no}</span>
                  <span className="project__title">{p.title}</span>
                  <span className="project__tag">{p.tag}</span>
                  <span className="project__toggle"><Icon name="plus" size={18} stroke={2.4} /></span>
                </button>
                <div className="project__body">
                  <div className="project__inner">
                    <div className="project__content">
                      <div className="project__visual" dangerouslySetInnerHTML={{ __html: visuals[p.visual] }} />
                      <div>
                        <ul>{p.bullets.map((b, j) => <li style={{ '--i': j }} key={b}>{b}</li>)}</ul>
                        <div className="chips">{p.chips.map((c, j) => <span className="chip" style={{ '--i': j + p.bullets.length }} key={c}>{c}</span>)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div
        ref={fpRef}
        className={`float-preview${preview !== null ? ' show' : ''}`}
        dangerouslySetInnerHTML={{ __html: preview !== null ? visuals[projects[preview].visual] : '' }}
      />
    </section>
  );
}

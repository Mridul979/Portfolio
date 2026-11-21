'use client';

import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/content';
import { visuals } from '@/data/visuals';
import Icon from './Icon';
import { SplitLines } from './Split';

export default function Work() {
  const [openIndex, setOpenIndex] = useState(0);
  const [preview, setPreview] = useState(0); // index of project in the floating preview
  const [showPreview, setShowPreview] = useState(false); // kept separate so it can fade out with its image
  const fpRef = useRef(null);
  const pos = useRef({ fx: 0, fy: 0, tx: 0, ty: 0 });

  // Keeps the 320×200 preview inside the viewport.
  const aim = (x, y) => {
    pos.current.tx = Math.max(176, Math.min(innerWidth - 176, x + 60));
    pos.current.ty = Math.max(116, Math.min(innerHeight - 116, y));
  };

  // Smoothly move the floating preview toward the cursor
  useEffect(() => {
    if (!showPreview) return;
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
  }, [showPreview]);

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
                  onClick={() => { setOpenIndex(open ? -1 : i); setShowPreview(false); }}
                  onMouseEnter={(e) => {
                    if (open || !canPreview()) return;
                    aim(e.clientX, e.clientY);
                    Object.assign(pos.current, { fx: pos.current.tx, fy: pos.current.ty });
                    setPreview(i);
                    setShowPreview(true);
                  }}
                  onMouseMove={(e) => aim(e.clientX, e.clientY)}
                  onMouseLeave={() => setShowPreview(false)}
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
        className={`float-preview${showPreview ? ' show' : ''}`}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: visuals[projects[preview].visual] }}
      />
    </section>
  );
}

'use client';

import { useState } from 'react';
import { skills } from '@/data/content';
import Icon from './Icon';
import { SplitLines } from './Split';

// Flip cards: the front shows only the title; hovering (or tapping on touch screens)
// turns the card over to reveal the tools, which pop in one by one.
export default function Skills() {
  const [flipped, setFlipped] = useState(-1);
  const tap = (i) => {
    if (matchMedia('(hover: none)').matches) setFlipped(flipped === i ? -1 : i);
  };

  return (
    <section className="skills pad" id="skills">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Toolkit</span>
            <SplitLines className="h2" style={{ marginTop: 20 }} lines={['Skills &', { em: 'technologies' }]} />
          </div>
          <p className="reveal">The languages, tools and platforms I use to break, build and ship things. Hover or tap a card to flip it.</p>
        </div>
        <div className="skills__grid">
          {skills.map((s, i) => (
            <div
              className={`skill-card reveal${flipped === i ? ' flipped' : ''}`}
              key={s.title}
              tabIndex={0}
              role="button"
              aria-pressed={flipped === i}
              aria-label={`${s.title}: ${s.items.join(', ')}`}
              data-hover
              onClick={() => tap(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(flipped === i ? -1 : i); } }}
            >
              <div className="skill-card__inner">
                <div className="skill-face skill-face--front" aria-hidden="true">
                  <div className="skill-face__top">
                    <div className="skill-card__icon"><Icon name={s.icon} /></div>
                    <span className="skill-face__no">/{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3>{s.title}</h3>
                    <span className="skill-face__hint">
                      <span className="skill-face__flip">↻</span> {s.items.length} tools · hover to reveal
                    </span>
                  </div>
                </div>
                <div className="skill-face skill-face--back" aria-hidden="true">
                  <div className="skill-face__top">
                    <span className="skill-face__label">{s.title}</span>
                    <span className="skill-face__no">/{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="chips">
                    {s.items.map((it, j) => <span className="chip" style={{ '--i': j }} key={it}>{it}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

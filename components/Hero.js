import { profile } from '@/data/content';
import { heroPill } from '@/data/visuals';
import Terminal from './Terminal';
import Icon from './Icon';
import { Chars, Roll } from './Split';

// Running letter index so the title cascades across all three lines.
const len = (s) => s.replace(/\s+/g, '').length;

export default function Hero() {
  const a = profile.name;
  const b1 = 'secures', b2 = 'systems';
  const c1 = '& builds', c2 = 'smart ones.';
  let i = 0;
  const at = (s) => { const s0 = i; i += len(s); return s0; };

  return (
    <section className="hero wrap">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="blob blob--1" data-depth="-40" />
        <div className="blob blob--2" data-depth="30" />
      </div>

      <div className="hero__top intro-fade">
        <span className="status" data-depth="6"><b />{profile.status}</span>
        <span className="eyebrow">{profile.role}</span>
      </div>

      <h1 className="hero__title" data-repel data-strength="1.4" aria-label={`${a} secures systems & builds smart ones.`}>
        <span className="line" aria-hidden="true"><Chars text={a} start={at(a)} /></span>
        <span className="line" aria-hidden="true">
          <Chars text={b1} start={at(b1)} className="muted" />{' '}
          <span className="pill-img" dangerouslySetInnerHTML={{ __html: heroPill }} />{' '}
          <Chars text={b2} start={at(b2)} />
        </span>
        <span className="line" aria-hidden="true">
          <Chars text={c1} start={at(c1)} />{' '}
          <Chars text={c2} start={at(c2)} className="muted" />
        </span>
      </h1>

      <div className="hero__bottom">
        <div className="intro-fade" style={{ '--d': '.9s' }}>
          <p className="hero__intro">
            Computer Science undergraduate at <strong>Central University of Jammu</strong>, specialising in cyber
            security — with hands-on work across <strong>network security</strong>, <strong>IoT / embedded
            systems</strong> and <strong>applied machine learning</strong>.
          </p>
          <div className="hero__cta">
            <a href="#work" className="btn magnetic"><Roll>See my work</Roll> <span className="arrow">→</span></a>
            <a href="#contact" className="btn btn--ghost magnetic"><Roll>Get in touch</Roll></a>
          </div>
        </div>

        <div className="intro-fade" style={{ '--d': '1.05s' }} data-depth="-14">
          <Terminal />
        </div>

        <div className="badge intro-fade" style={{ '--d': '1.2s' }}>
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text fontSize="15.5" fontWeight="700" letterSpacing="3.2" fill="#0e0e0e">
              <textPath href="#circ">SCROLL DOWN • CYBER SECURITY • IOT • ML • </textPath>
            </text>
          </svg>
          <a href="#about" aria-label="Scroll to about"><Icon name="arrowDown" size={26} stroke={2.4} /></a>
        </div>
      </div>
    </section>
  );
}

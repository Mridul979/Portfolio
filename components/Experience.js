import { experience } from '@/data/content';
import { SplitLines } from './Split';

export default function Experience() {
  return (
    <section className="pad" id="experience">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Leadership</span>
            <SplitLines className="h2" style={{ marginTop: 20 }} lines={['Achievements &', { em: 'leadership' }]} />
          </div>
          <p className="reveal">Beyond code — leading people, navigating terrain and competing on the court.</p>
        </div>
        <div className="exp__list">
          {experience.map((x, i) => (
            <article className={`exp stagger${x.accent ? ' exp--accent' : ''}`} style={{ '--i': i }} key={x.title}>
              <div className="exp__when">{x.when}<br /><span className="chip">{x.chip}</span></div>
              <div>
                <h3>{x.title}</h3>
                <h4>{x.org}</h4>
                <ul>{x.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

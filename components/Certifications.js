import { certifications } from '@/data/content';
import Icon from './Icon';
import { SplitLines } from './Split';

export default function Certifications() {
  return (
    <section className="pad" id="certifications" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Learning</span>
            <SplitLines className="h2" style={{ marginTop: 20 }} lines={['Certifications']} />
          </div>
        </div>
        <div className="certs">
          {certifications.map((c, i) => (
            <div className="cert reveal" key={c.title}>
              <div className="cert__top">
                <span className="cert__no">/{String(i + 1).padStart(2, '0')}</span>
                <Icon name="arrowUpRight" size={22} />
              </div>
              <div><h3>{c.title}</h3><p>{c.issuer}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

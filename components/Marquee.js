import { marquee } from '@/data/content';

export default function Marquee() {
  // Items are rendered twice so the -50% scroll loops seamlessly.
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
}

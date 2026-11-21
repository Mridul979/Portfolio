// Text-splitting helpers for the motion system. Pure markup, so they work in server components.

// Splits a string into per-letter spans. Words stay unbroken; `start` offsets the stagger index
// so several calls can share one continuous cascade.
export function Chars({ text, start = 0, className = '' }) {
  let i = start;
  return text.split(/(\s+)/).map((word, w) => {
    if (!word.trim()) return word;
    return (
      <span className={`word ${className}`} key={w}>
        {[...word].map((ch, c) => (
          <span className="char" style={{ '--i': i++ }} key={c}>{ch}</span>
        ))}
      </span>
    );
  });
}

// Masked line-by-line reveal for headings. `lines` is an array of strings or { em: string }.
// The `.split-reveal` class is picked up by the scroll observer in Interactions.
export function SplitLines({ as: Tag = 'h2', className = '', lines, style }) {
  return (
    <Tag className={`${className} split-reveal`} style={style} data-repel aria-label={lines.map((l) => (typeof l === 'string' ? l : l.em)).join(' ')}>
      {lines.map((l, i) => (
        <span className="sl" key={i} aria-hidden="true">
          <span className="sl__in" style={{ '--i': i }}>
            {typeof l === 'string' ? <Chars text={l} /> : <em><Chars text={l.em} /></em>}
          </span>
        </span>
      ))}
    </Tag>
  );
}

// Hover "roll": the label slides up and an identical copy rolls in from below.
export function Roll({ children }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { terminalScript } from '@/data/content';

const line = ([type, text]) =>
  type === 'cmd' ? `<span class="p">$</span> ${text}` : `<span class="${type}">${text}</span>`;

// Types out a fake scan session, then loops.
export default function Terminal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));

    async function run() {
      if (reduce) { el.innerHTML = terminalScript.map(line).join('\n'); return; }
      while (!cancelled) {
        let html = '';
        for (const [type, text] of terminalScript) {
          if (type === 'cmd') {
            const pre = `${html}<span class="p">$</span> `;
            for (let c = 1; c <= text.length; c++) {
              if (cancelled) return;
              el.innerHTML = `${pre}${text.slice(0, c)}<span class="caret"></span>`;
              await wait(45);
            }
            html = `${pre}${text}\n`;
            await wait(350);
          } else {
            if (cancelled) return;
            html += `${line([type, text])}\n`;
            el.innerHTML = html;
            await wait(280);
          }
        }
        if (cancelled) return;
        el.innerHTML = `${html}<span class="p">$</span> <span class="caret"></span>`;
        await wait(4000);
      }
    }

    if (document.body.classList.contains('ready')) run();
    else addEventListener('app-ready', run, { once: true });
    return () => { cancelled = true; timers.forEach(clearTimeout); removeEventListener('app-ready', run); };
  }, []);

  return (
    <div className="terminal" aria-label="Animated terminal">
      <div className="terminal__bar"><i /><i /><i /><span>mridul@kali: ~</span></div>
      <pre ref={ref} />
    </div>
  );
}

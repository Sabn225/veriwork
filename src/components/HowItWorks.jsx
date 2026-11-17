'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5'];

// Vertical timeline. As each step scrolls into the middle of the viewport it becomes active and the spine fills behind it.
// Without JavaScript (or with reduced motion) every step is simply readable in its idle state.
export default function HowItWorks() {
  const { t } = useLanguage();
  const listRef = useRef(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const items = listRef.current ? listRef.current.querySelectorAll('[data-step]') : [];
    if (!items.length || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.step)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section section-alt" id="how-it-works" aria-labelledby="how-title">
      <div className="container split">
        <header className="split-head">
          <h2 id="how-title" className="section-title">{t('how.title')}</h2>
          <p className="section-lead">{t('how.lead')}</p>
        </header>

        <ol className="timeline" ref={listRef}>
          {STEPS.map((k, i) => (
            <li key={k} className="tl-step" data-step={i} data-state={i < active ? 'done' : i === active ? 'active' : 'idle'}>
              <span className="tl-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="tl-body">
                <h3 className="tl-title">{t(`${k}.title`)}</h3>
                <p className="tl-text">{t(`${k}.text`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

'use client';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../lib/LanguageContext';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Modal dialog (variant "modal") or side drawer (variant "drawer").
// Focus moves in on open, Tab is kept inside, Escape and a click on the backdrop close it,
// the page behind does not scroll, and focus returns to the control that opened it.
export default function Dialog({ open, onClose, title, variant = 'modal', children }) {
  const { t } = useLanguage();
  const titleId = useId();
  const ref = useRef(null);
  // Kept in a ref so a parent re-render (new onClose identity) never re-runs the effect and steals focus.
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; });

  useEffect(() => {
    if (!open) return undefined;
    const node = ref.current;
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (node.querySelector('[data-autofocus]') || node).focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); return; }
      if (e.key !== 'Tab') return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) { e.preventDefault(); node.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === node)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (opener && opener.focus && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="dialog-overlay" data-variant={variant} onMouseDown={(e) => { if (e.target === e.currentTarget) closeRef.current(); }}>
      <div className="dialog" data-variant={variant} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={ref}>
        <div className="dialog-head">
          <h2 id={titleId} className="dialog-title">{title}</h2>
          <button type="button" className="dialog-close" aria-label={t('nav.close')} onClick={() => closeRef.current()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

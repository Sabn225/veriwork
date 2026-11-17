'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { CATEGORIES, browseHref, loc } from '../lib/categories';

const CHEVRON_DOWN = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;
const CHEVRON_RIGHT = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>;

// ---------------------------------------------------------------------------------------------
// NavMenu: a header button that opens a panel.
// Opens on mouse hover, on click and on Enter/Space. Closes on Escape (focus returns to the button),
// on a click or focus outside, and when the page changes. Panels are always in the DOM (hidden when closed)
// so aria-controls always points at something real. Only one menu is open at a time: the parent owns `open`.
// ---------------------------------------------------------------------------------------------
export function NavMenu({ id, label, open, onToggle, onClose, current, variant = 'mega', children }) {
  const wrap = useRef(null);
  const button = useRef(null);
  const timer = useRef(null);
  const byHover = useRef(false);
  const panelId = `${useId()}-panel`;

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (!open) byHover.current = false; }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const outside = (e) => { if (!wrap.current?.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') { onClose(); button.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Hover is for mice only; touch and pen use the click on the button.
  const enter = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    if (!open) { byHover.current = true; onToggle(id, true); }
  };
  const leave = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onClose(id), 160); // closes only this menu, never a sibling the pointer has already moved to
  };

  // A mouse click on a menu that hover just opened keeps it open, instead of closing it again.
  const click = () => {
    if (byHover.current && open) { byHover.current = false; return; }
    onToggle(id);
  };

  return (
    <li className={`nav-item nav-item-${variant}`} ref={wrap} onPointerEnter={enter} onPointerLeave={leave}>
      <button
        type="button"
        ref={button}
        className="nav-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={current}
        onClick={click}
      >
        {label}
        {CHEVRON_DOWN}
      </button>
      <div id={panelId} className={`nav-panel nav-panel-${variant}`} hidden={!open} tabIndex={-1}>
        {children}
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------------------------
// Categories on the left, the selected category's subcategories on the right, quick links along the bottom.
// The left column is a vertical tab list: arrow keys move between categories, Tab goes straight into the
// subcategories of the selected one, so keyboard users never have to walk through every category first.
// ---------------------------------------------------------------------------------------------
export function CategoriesPanel({ onNavigate }) {
  const { t, language } = useLanguage();
  const [active, setActive] = useState(CATEGORIES[0].key);
  const tabs = useRef([]);

  const move = (e, i) => {
    const last = CATEGORIES.length - 1;
    const next = { ArrowDown: i === last ? 0 : i + 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(CATEGORIES[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mega">
      <div className="mega-body">
        <div className="mega-cats">
          <p className="mega-label" id="mega-cats-label">{t('menu.categories')}</p>
          <div role="tablist" aria-orientation="vertical" aria-labelledby="mega-cats-label">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                id={`mega-tab-${c.key}`}
                ref={(el) => { tabs.current[i] = el; }}
                className="mega-cat"
                aria-selected={active === c.key}
                aria-controls={`mega-panel-${c.key}`}
                tabIndex={active === c.key ? 0 : -1}
                onMouseEnter={() => setActive(c.key)}
                onClick={() => setActive(c.key)}
                onKeyDown={(e) => move(e, i)}
              >
                {t(`cat.${c.key}`)}
                {CHEVRON_RIGHT}
              </button>
            ))}
          </div>
        </div>

        <div className="mega-subs">
          {CATEGORIES.map((c) => (
            <div key={c.key} role="tabpanel" id={`mega-panel-${c.key}`} aria-labelledby={`mega-tab-${c.key}`} hidden={active !== c.key}>
              <div className="mega-subs-head">
                <p className="mega-label">{t(`cat.${c.key}`)}</p>
                <Link className="mega-all" href={browseHref({ category: c.key })} onClick={onNavigate}>{t('menu.seeAllCat')}</Link>
              </div>
              <ul className="mega-sub-list">
                {c.subs.map((s) => (
                  <li key={s.key}>
                    <Link className="mega-sub" href={browseHref({ category: c.key, sub: s.key })} onClick={onNavigate}>
                      <span className="mega-sub-name">{loc(s.name, language)}</span>
                      <span className="mega-sub-desc">{loc(s.desc, language)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mega-foot">
        <Link href="/browse" onClick={onNavigate}>{t('menu.seeAll')}{CHEVRON_RIGHT}</Link>
        <Link href="/signup" onClick={onNavigate}>{t('menu.buildProfile')}{CHEVRON_RIGHT}</Link>
        <Link href="/#trust" onClick={onNavigate}>{t('menu.howVerified')}{CHEVRON_RIGHT}</Link>
      </div>
    </div>
  );
}

// A short list of links, each with one line of explanation.
export function LinksPanel({ items, onNavigate }) {
  const { t } = useLanguage();
  return (
    <ul className="drop-list">
      {items.map((item) => (
        <li key={item.key}>
          <Link className="mega-sub" href={item.href} onClick={onNavigate}>
            <span className="mega-sub-name">{t(item.key)}</span>
            <span className="mega-sub-desc">{t(item.desc)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

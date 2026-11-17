'use client';
import { useEffect, useRef } from 'react';

export const tabId = (prefix, id) => `${prefix}-tab-${id}`;
export const panelId = (prefix, id) => `${prefix}-panel-${id}`;

// Accessible tabs with automatic activation: one tab is in the tab order, arrow keys / Home / End move between tabs.
// The caller renders the matching <div role="tabpanel" id={panelId(prefix, value)} aria-labelledby={tabId(prefix, value)}>.
export default function Tabs({ tabs, value, onChange, label, vertical = false, idPrefix = 'tabs' }) {
  const refs = useRef({});

  useEffect(() => {
    const el = refs.current[value];
    const strip = el && el.parentElement;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollLeft = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2;
  }, [value]);

  const onKeyDown = (e, index) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  };

  return (
    <div className={`tabs${vertical ? ' tabs-vertical' : ''}`} role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : 'horizontal'}>
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => { refs.current[tab.id] = el; }}
          type="button"
          role="tab"
          className="tab"
          id={tabId(idPrefix, tab.id)}
          aria-selected={value === tab.id}
          aria-controls={panelId(idPrefix, tab.id)}
          tabIndex={value === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {tab.label}
          {typeof tab.count === 'number' && <span className="tab-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

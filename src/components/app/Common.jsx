'use client';
import { useId } from 'react';
import { useLanguage } from '../../lib/LanguageContext';

const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  projects: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  services: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />,
  trust: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>,
  settings: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
  logout: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  bookmark: <path d="M6 4h12v17l-6-4-6 4V4z" />,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8z" /><circle cx="12" cy="13" r="3.5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
};

export function Icon({ name }) {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>;
}

export function PageHeader({ title, lead, actions }) {
  return (
    <header className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function Section({ id, title, action, children, className = '' }) {
  const auto = useId();
  const headingId = `${id || auto}-h`;
  return (
    <section className={`app-section ${className}`.trim()} id={id} aria-labelledby={headingId}>
      <div className="app-section-head">
        <h2 id={headingId} className="app-section-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// Every status is a label plus a shape (check, ring, dot), never colour alone.
const STATUS = {
  verified: { cls: 'badge-verified', key: 'cred.badge', check: true },
  self: { cls: 'badge-self', key: 'cred.selfTitle' },
  pending: { cls: 'badge-pending', key: 'status.pending' },
  review: { cls: 'badge-pending', key: 'status.review' },
  submitted: { cls: 'badge-neutral badge-dot', key: 'status.submitted' },
  shortlisted: { cls: 'badge-info badge-dot', key: 'status.shortlisted' },
  withdrawn: { cls: 'badge-neutral badge-dot', key: 'status.withdrawn' },
  closed: { cls: 'badge-neutral badge-dot', key: 'status.closed' },
  active: { cls: 'badge-ok badge-dot', key: 'status.active' },
  paused: { cls: 'badge-neutral badge-dot', key: 'status.paused' },
  inprogress: { cls: 'badge-info badge-dot', key: 'status.inprogress' },
};

export function StatusBadge({ status }) {
  const { t } = useLanguage();
  const s = STATUS[status] || STATUS.submitted;
  return (
    <span className={`badge ${s.cls}`}>
      {s.check && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>}
      {t(s.key)}
    </span>
  );
}

export function Progress({ value, max = 100, label }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Avatar({ name = '', src, size = 40 }) {
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
  return (
    <span className="avatar" style={{ '--avatar': `${size}px` }}>
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}

// Dates are stored as YYYY-MM-DD. Formatting in UTC keeps server and browser output identical.
export function formatDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export const fold = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

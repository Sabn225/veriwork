'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { SAMPLE_PROJECTS, PROJECT_CATEGORIES } from '../lib/sampleProjects';

const pick = (value, lang) => value[lang] || value.en;
// Lower-case and strip accents so that typing "thiet ke" still finds "thiết kế".
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

const SEARCH_ICON = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
const CHEVRON = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;

// Search, category filter and expandable details run on illustrative sample data (lib/sampleProjects.js).
// "Apply" leads to sign up, because applying needs an account.
export default function ProjectExplorer() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  const results = useMemo(() => {
    const q = fold(query.trim());
    return SAMPLE_PROJECTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      const haystack = fold([pick(p.title, language), pick(p.summary, language), ...p.skills].join(' '));
      return haystack.includes(q);
    });
  }, [query, category, language]);

  const clear = () => { setQuery(''); setCategory('all'); };
  const filtered = query !== '' || category !== 'all';

  return (
    <section className="section section-alt" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head-row">
          <h2 id="projects-title" className="section-title">{t('projects.title')}</h2>
          <p className="section-lead">{t('projects.lead')}</p>
        </header>

        <div className="explorer">
          <form className="explorer-toolbar" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              {SEARCH_ICON}
              <label className="visually-hidden" htmlFor="project-search">{t('projects.searchLabel')}</label>
              <input id="project-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('projects.search')} autoComplete="off" />
            </div>
            <div className="chips" role="group" aria-label={t('projects.category')}>
              {['all', ...PROJECT_CATEGORIES].map((c) => (
                <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
                  {t(`cat.${c}`)}
                </button>
              ))}
            </div>
          </form>

          <p className="explorer-count" aria-live="polite">{results.length} {t('projects.count')}</p>

          {results.length === 0 ? (
            <div className="explorer-empty">
              <p>{t('projects.empty')}</p>
              {filtered && <button type="button" className="btn btn-secondary btn-sm" onClick={clear}>{t('projects.clear')}</button>}
            </div>
          ) : (
            <ul className="project-list">
              {results.map((p) => {
                const open = openId === p.id;
                const detailId = `project-detail-${p.id}`;
                return (
                  <li key={p.id} className="project">
                    <div className="project-main">
                      <div className="project-head">
                        <h3 className="project-title">{pick(p.title, language)}</h3>
                        <p className="project-budget">
                          {`$${p.budget.min}–$${p.budget.max}`}
                          <span>{p.budget.unit === 'hour' ? t('projects.hourly') : t('projects.fixed')}</span>
                        </p>
                      </div>
                      <p className="project-meta">{t(`cat.${p.category}`)} · {pick(p.duration, language)}</p>
                      <p className="project-summary">{pick(p.summary, language)}</p>
                      <ul className="tags">
                        {p.skills.map((s) => <li key={s} className="tag">{s}</li>)}
                      </ul>
                    </div>

                    <div className="project-actions">
                      <button type="button" className="project-toggle" aria-expanded={open} aria-controls={detailId} onClick={() => setOpenId(open ? null : p.id)}>
                        {open ? t('projects.hide') : t('projects.details')}
                        {CHEVRON}
                      </button>
                      <Link className="btn btn-primary btn-sm" href="/signup">{t('projects.apply')}</Link>
                    </div>

                    {open && (
                      <div id={detailId} className="project-detail">
                        <p>{pick(p.detail, language)}</p>
                        <p className="project-note">{t('projects.applyNote')}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="explorer-foot">
            <Link className="btn btn-secondary btn-sm" href="/browse">{t('projects.browseAll')}</Link>
            <p className="sample-note">{t('projects.sample')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

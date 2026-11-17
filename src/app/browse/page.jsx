'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { SAMPLE_PROJECTS } from '../../lib/sampleProjects';
import { CATEGORIES, PROJECT_TYPES, browseHref, filterProjects, findCategory, findSub, fold, loc } from '../../lib/categories';
import '../landing.css'; // project rows (.project, .tags, .explorer-*) are shared with the home-page explorer
import './browse.css';

const SEARCH_ICON = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
const CHEVRON = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>;

// Public "Browse projects" page. Every filter lives in the URL (?category=&sub=&type=&skill=&q=), so a filtered view can be
// bookmarked, shared and reached from the header menu. It runs on the labelled sample data in lib/sampleProjects.js.
function BrowseContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openId, setOpenId] = useState(null);

  // Only accept values we know; anything else in the URL is ignored.
  const params = useMemo(() => {
    const get = (k) => searchParams.get(k) || '';
    const category = findCategory(get('category')) ? get('category') : '';
    const sub = category && findSub(category, get('sub')) ? get('sub') : '';
    const type = PROJECT_TYPES.includes(get('type')) ? get('type') : '';
    return { category, sub, type, skill: get('skill'), q: get('q') };
  }, [searchParams]);

  // The search box is typed into freely and written to the URL after a short pause.
  const [q, setQ] = useState(params.q);
  const pushedQ = useRef(params.q);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    if (params.q !== pushedQ.current) { pushedQ.current = params.q; setQ(params.q); }
  }, [params.q]);

  useEffect(() => {
    if (q === pushedQ.current) return undefined;
    const id = setTimeout(() => {
      pushedQ.current = q;
      router.replace(browseHref({ ...paramsRef.current, q }), { scroll: false });
    }, 250);
    return () => clearTimeout(id);
  }, [q, router]);

  const current = { ...params, q };
  const run = (over = {}) => filterProjects(SAMPLE_PROJECTS, { ...current, ...over }, language);
  const results = useMemo(run, [params, q, language]); // eslint-disable-line react-hooks/exhaustive-deps
  const href = (over) => browseHref({ ...current, ...over });
  const go = (over) => router.push(href(over), { scroll: false });

  // Skills offered as a filter: those in the projects that match everything except the skill itself.
  const skills = useMemo(() => {
    const set = new Map();
    run({ skill: '' }).forEach((p) => p.skills.forEach((s) => set.set(fold(s), s)));
    if (params.skill && !set.has(fold(params.skill))) set.set(fold(params.skill), params.skill);
    return [...set.values()].sort((a, b) => a.localeCompare(b));
  }, [params, q, language]); // eslint-disable-line react-hooks/exhaustive-deps

  const cat = findCategory(params.category);
  const sub = cat ? findSub(cat.key, params.sub) : null;
  const heading = sub ? loc(sub.name, language) : cat ? t(`cat.${cat.key}`) : t('browse.title');
  const lead = sub ? loc(sub.desc, language) : t('browse.lead');
  const filtered = Boolean(params.category || params.type || params.skill || q.trim());

  useEffect(() => { document.title = `${heading} – VeriWork`; }, [heading]);

  const typeLabel = { '': t('browse.typeAny'), fixed: t('browse.typeFixed'), hour: t('browse.typeHour') };

  return (
    <main id="main" className="browse">
      <div className="container">
        <nav className="crumbs" aria-label={t('browse.breadcrumb')}>
          <ol>
            <li>{cat ? <Link href="/browse">{t('browse.title')}</Link> : <span aria-current="page">{t('browse.title')}</span>}</li>
            {cat && <li>{sub ? <Link href={browseHref({ category: cat.key })}>{t(`cat.${cat.key}`)}</Link> : <span aria-current="page">{t(`cat.${cat.key}`)}</span>}</li>}
            {sub && <li><span aria-current="page">{loc(sub.name, language)}</span></li>}
          </ol>
        </nav>

        <header className="browse-head">
          <h1 className="browse-title">{heading}</h1>
          <p className="browse-lead">{lead}</p>
        </header>

        <div className="browse-grid">
          <aside className="facets" aria-label={t('browse.filters')}>
            <section aria-labelledby="facet-cats">
              <h2 className="facet-title" id="facet-cats">{t('menu.categories')}</h2>
              <ul className="facet-list">
                <li>
                  <Link className="facet-link" scroll={false} href={href({ category: '', sub: '', skill: '' })} aria-current={!params.category ? 'true' : undefined}>
                    {t('cat.all')}<span className="facet-count">{run({ category: '', sub: '', skill: '' }).length}</span>
                  </Link>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.key}>
                    <Link className="facet-link" scroll={false} href={href({ category: c.key, sub: '', skill: '' })} aria-current={params.category === c.key ? 'true' : undefined}>
                      {t(`cat.${c.key}`)}<span className="facet-count">{run({ category: c.key, sub: '', skill: '' }).length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {cat && (
              <section aria-labelledby="facet-subs">
                <h2 className="facet-title" id="facet-subs">{t(`cat.${cat.key}`)}</h2>
                <ul className="facet-list">
                  <li>
                    <Link className="facet-link" scroll={false} href={href({ sub: '', skill: '' })} aria-current={!params.sub ? 'true' : undefined}>
                      {t('browse.allSubs')}<span className="facet-count">{run({ sub: '', skill: '' }).length}</span>
                    </Link>
                  </li>
                  {cat.subs.map((s) => (
                    <li key={s.key}>
                      <Link className="facet-link" scroll={false} href={href({ sub: s.key, skill: '' })} aria-current={params.sub === s.key ? 'true' : undefined}>
                        {loc(s.name, language)}<span className="facet-count">{run({ sub: s.key, skill: '' }).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="facet-type">
              <h2 className="facet-title" id="facet-type">{t('browse.type')}</h2>
              <ul className="facet-list">
                {['', ...PROJECT_TYPES].map((v) => (
                  <li key={v || 'any'}>
                    <Link className="facet-link" scroll={false} href={href({ type: v })} aria-current={params.type === v ? 'true' : undefined}>
                      {typeLabel[v]}<span className="facet-count">{run({ type: v }).length}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {skills.length > 0 && (
              <section aria-labelledby="facet-skills">
                <h2 className="facet-title" id="facet-skills">{t('browse.skills')}</h2>
                <ul className="chips">
                  {skills.map((s) => (
                    <li key={s}>
                      <button type="button" className="chip" aria-pressed={fold(params.skill) === fold(s)} onClick={() => go({ skill: fold(params.skill) === fold(s) ? '' : s })}>{s}</button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          <section className="browse-results" aria-label={t('browse.results')}>
            <form className="browse-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <div className="field">
                {SEARCH_ICON}
                <label className="visually-hidden" htmlFor="browse-search">{t('projects.searchLabel')}</label>
                <input id="browse-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('projects.search')} autoComplete="off" />
              </div>
            </form>

            <div className="browse-count-row">
              <p className="explorer-count" aria-live="polite">{results.length} {t('projects.count')}</p>
              {filtered && <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setQ(''); pushedQ.current = ''; router.push('/browse', { scroll: false }); }}>{t('projects.clear')}</button>}
            </div>

            {results.length === 0 ? (
              <div className="explorer-empty">
                <p>{t('projects.empty')}</p>
              </div>
            ) : (
              <ul className="project-list">
                {results.map((p) => {
                  const open = openId === p.id;
                  const detailId = `browse-detail-${p.id}`;
                  return (
                    <li key={p.id} className="project">
                      <div className="project-main">
                        <div className="project-head">
                          <h2 className="project-title">{loc(p.title, language)}</h2>
                          <p className="project-budget">
                            {`$${p.budget.min}–$${p.budget.max}`}
                            <span>{p.budget.unit === 'hour' ? t('projects.hourly') : t('projects.fixed')}</span>
                          </p>
                        </div>
                        <p className="project-meta">{t(`cat.${p.category}`)} · {loc(p.duration, language)}</p>
                        <p className="project-summary">{loc(p.summary, language)}</p>
                        <ul className="tags">
                          {p.skills.map((s) => (
                            <li key={s}>
                              <button type="button" className="tag tag-btn" aria-pressed={fold(params.skill) === fold(s)} aria-label={`${t('browse.filterSkill')}: ${s}`} onClick={() => go({ skill: fold(params.skill) === fold(s) ? '' : s })}>{s}</button>
                            </li>
                          ))}
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
                          <p>{loc(p.detail, language)}</p>
                          <p className="project-note">{t('projects.applyNote')}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="sample-note">{t('projects.sample')}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense boundary so the rest of the site can still be prerendered.
export default function BrowsePage() {
  return (
    <Suspense fallback={<main id="main" className="browse" aria-busy="true" />}>
      <BrowseContent />
    </Suspense>
  );
}

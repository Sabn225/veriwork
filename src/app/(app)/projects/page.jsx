'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { SAMPLE_PROJECTS, PROJECT_CATEGORIES } from '../../../lib/sampleProjects';
import { loc } from '../../../lib/sampleApp';
import { useApp, todayISO } from '../../../components/app/AppState';
import { Icon, PageHeader, StatusBadge, formatDate, fold } from '../../../components/app/Common';
import Dialog from '../../../components/app/Dialog';
import Tabs, { panelId, tabId } from '../../../components/app/Tabs';
import TextField from '../../../components/Field';

const TAB_IDS = ['discover', 'saved', 'applications'];
const WITHDRAWABLE = ['submitted', 'review', 'shortlisted'];
const budgetText = (b) => `$${b.min}–$${b.max}`;

function useProjectHelpers() {
  const { state } = useApp();
  const mine = useMemo(() => new Set(state.skills.map((s) => fold(s.name))), [state.skills]);
  return {
    isMine: (skill) => mine.has(fold(skill)),
    matchCount: (p) => p.skills.filter((s) => mine.has(fold(s))).length,
    activeApplication: (id) => state.applications.find((a) => a.projectId === id && a.status !== 'withdrawn'),
  };
}

// Details drawer: the project, how well it matches the profile, and the apply form.
// The body is mounted only while the drawer is open, so the cover note always starts empty.
function DrawerBody({ project, onClose }) {
  const { t, language } = useLanguage();
  const { state, dispatch } = useApp();
  const { isMine, matchCount, activeApplication } = useProjectHelpers();
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [justApplied, setJustApplied] = useState(false);
  const doneRef = useRef(null);

  const app = activeApplication(project.id);
  const saved = state.saved.includes(project.id);
  const match = matchCount(project);
  const formId = `apply-${project.id}`;

  // The submit button disappears after applying, so move focus to the confirmation instead of losing it.
  useEffect(() => { if (justApplied && doneRef.current) doneRef.current.focus(); }, [justApplied]);

  const submit = (e) => {
    e.preventDefault();
    if (!note.trim()) { setError(t('form.required')); return; }
    dispatch({ type: 'apply', projectId: project.id, when: todayISO(), note: note.trim() });
    setJustApplied(true);
  };

  return (
    <>
      <div className="dialog-body">
        <div className="detail-head">
          <p className="row-meta">{t(`cat.${project.category}`)} · {loc(project.duration, language)}</p>
          <p className="budget">{budgetText(project.budget)}<small>{project.budget.unit === 'hour' ? t('projects.hourly') : t('projects.fixed')}</small></p>
        </div>

        <div className="detail-block">
          <h3>{t('pj.about')}</h3>
          <p>{loc(project.summary, language)}</p>
          <p style={{ marginTop: 8 }}>{loc(project.detail, language)}</p>
        </div>

        <div className="detail-block">
          <h3>{t('pj.skillsNeeded')}</h3>
          <ul className="tags">
            {project.skills.map((s) => <li key={s} className={`tag${isMine(s) ? ' tag-match' : ''}`}>{s}</li>)}
          </ul>
          {match > 0 && <p className="match-note">{match} {match === 1 ? t('pj.skillMatch') : t('pj.skillsMatch')}</p>}
        </div>

        <div className="detail-block">
          {app ? (
            <>
              <h3>{t('pj.applied')}</h3>
              <p><StatusBadge status={app.status} /> {t('pj.appliedOn')} {formatDate(app.when, language)}</p>
              {justApplied && <p className="form-alert" data-tone="success" role="status" tabIndex={-1} ref={doneRef} style={{ marginTop: 12 }}>{t('pj.submitted')}</p>}
            </>
          ) : (
            <form id={formId} noValidate onSubmit={submit}>
              <TextField
                as="textarea" rows={5} name="note" label={t('pj.coverNote')} hint={t('pj.coverHint')} required
                value={note} onChange={(e) => { setNote(e.target.value); setError(''); }} error={error}
              />
            </form>
          )}
        </div>
      </div>

      <div className="dialog-foot">
        <button type="button" className="btn btn-secondary btn-save" style={{ marginRight: 'auto' }} aria-pressed={saved} onClick={() => dispatch({ type: 'toggleSaved', id: project.id })}>
          <Icon name="bookmark" />{t('pj.save')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>{t('nav.close')}</button>
        {!app && <button type="submit" form={formId} className="btn btn-primary">{t('pj.submit')}</button>}
      </div>
    </>
  );
}

export default function ProjectsPage() {
  usePageTitle('app.nav.projects');
  const { t, language } = useLanguage();
  const { state, dispatch } = useApp();
  const { isMine, matchCount, activeApplication } = useProjectHelpers();

  const [tab, setTab] = useState('discover');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  // Deep links: /projects?project=p3 opens that project, /projects#applications opens that tab.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('project');
    if (id && SAMPLE_PROJECTS.some((p) => p.id === id)) setOpenId(id);
    const hash = window.location.hash.slice(1);
    if (TAB_IDS.includes(hash)) setTab(hash);
  }, []);

  const changeTab = (id) => {
    setTab(id);
    try { window.history.replaceState(null, '', `#${id}`); } catch (e) { /* ignore */ }
  };

  const discover = useMemo(() => {
    const q = fold(query.trim());
    return SAMPLE_PROJECTS
      .filter((p) => {
        if (category !== 'all' && p.category !== category) return false;
        if (!q) return true;
        return fold([loc(p.title, language), loc(p.summary, language), ...p.skills].join(' ')).includes(q);
      })
      .map((p) => ({ p, m: matchCount(p) }))
      .sort((a, b) => b.m - a.m)
      .map((x) => x.p);
    // matchCount depends on the profile skills
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, language, state.skills]);

  const savedProjects = state.saved.map((id) => SAMPLE_PROJECTS.find((p) => p.id === id)).filter(Boolean);
  const applications = state.applications.map((a) => ({ a, p: SAMPLE_PROJECTS.find((p) => p.id === a.projectId) })).filter((x) => x.p);
  const openProject = SAMPLE_PROJECTS.find((p) => p.id === openId) || null;

  const tabs = [
    { id: 'discover', label: t('pj.tab.discover') },
    { id: 'saved', label: t('pj.tab.saved'), count: savedProjects.length },
    { id: 'applications', label: t('pj.tab.applications'), count: applications.length },
  ];

  const ProjectRow = ({ p }) => {
    const saved = state.saved.includes(p.id);
    const app = activeApplication(p.id);
    const match = matchCount(p);
    const title = loc(p.title, language);
    return (
      <li className="row">
        <div className="row-main">
          <h2 className="row-title">{title}</h2>
          <p className="row-meta">{t(`cat.${p.category}`)} · {loc(p.duration, language)}</p>
          <p className="row-text">{loc(p.summary, language)}</p>
          <ul className="tags">{p.skills.map((s) => <li key={s} className={`tag${isMine(s) ? ' tag-match' : ''}`}>{s}</li>)}</ul>
          {match > 0 && <p className="match-note">{match} {match === 1 ? t('pj.skillMatch') : t('pj.skillsMatch')}</p>}
          <div className="row-actions">
            <button type="button" className="btn btn-secondary btn-sm" aria-label={`${t('pj.details')}: ${title}`} onClick={() => setOpenId(p.id)}>{t('pj.details')}</button>
            <button type="button" className="btn btn-secondary btn-sm btn-save" aria-pressed={saved} aria-label={`${t('pj.save')}: ${title}`} onClick={() => dispatch({ type: 'toggleSaved', id: p.id })}>
              <Icon name="bookmark" />{t('pj.save')}
            </button>
          </div>
        </div>
        <div className="row-side">
          <p className="budget">{budgetText(p.budget)}<small>{p.budget.unit === 'hour' ? t('projects.hourly') : t('projects.fixed')}</small></p>
          {app && <StatusBadge status={app.status} />}
        </div>
      </li>
    );
  };

  const panelProps = (id) => ({ role: 'tabpanel', id: panelId('pj', id), 'aria-labelledby': tabId('pj', id), tabIndex: 0 });

  return (
    <>
      <PageHeader title={t('pj.title')} lead={t('pj.lead')} />
      <Tabs idPrefix="pj" label={t('pj.title')} tabs={tabs} value={tab} onChange={changeTab} />

      {tab === 'discover' && (
        <div {...panelProps('discover')}>
          <form className="pj-toolbar" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="field">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <label className="visually-hidden" htmlFor="pj-search">{t('projects.searchLabel')}</label>
              <input id="pj-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('projects.search')} autoComplete="off" />
            </div>
            <div className="chips" role="group" aria-label={t('projects.category')}>
              {['all', ...PROJECT_CATEGORIES].map((c) => (
                <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>{t(`cat.${c}`)}</button>
              ))}
            </div>
          </form>
          <p className="pj-count" aria-live="polite">{discover.length} {t('projects.count')}</p>
          {discover.length === 0 ? (
            <div className="empty">
              <p>{t('projects.empty')}</p>
              <button type="button" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => { setQuery(''); setCategory('all'); }}>{t('projects.clear')}</button>
            </div>
          ) : (
            <ul className="rows">{discover.map((p) => <ProjectRow key={p.id} p={p} />)}</ul>
          )}
          <p className="sample-note">{t('projects.sample')}</p>
        </div>
      )}

      {tab === 'saved' && (
        <div {...panelProps('saved')} style={{ marginTop: 20 }}>
          {savedProjects.length === 0 ? <p className="empty">{t('pj.noSaved')}</p> : <ul className="rows">{savedProjects.map((p) => <ProjectRow key={p.id} p={p} />)}</ul>}
        </div>
      )}

      {tab === 'applications' && (
        <div {...panelProps('applications')} style={{ marginTop: 20 }}>
          {applications.length === 0 ? <p className="empty">{t('pj.noApps')}</p> : (
            <ul className="rows">
              {applications.map(({ a, p }) => {
                const title = loc(p.title, language);
                return (
                  <li key={a.id} className="row">
                    <div className="row-main">
                      <h2 className="row-title">{title}</h2>
                      <p className="row-meta">{t('pj.appliedOn')} {formatDate(a.when, language)}</p>
                      <div className="row-actions">
                        <button type="button" className="btn btn-secondary btn-sm" aria-label={`${t('pj.viewProject')}: ${title}`} onClick={() => setOpenId(p.id)}>{t('pj.viewProject')}</button>
                        {WITHDRAWABLE.includes(a.status) && (
                          <button type="button" className="btn btn-ghost btn-sm" aria-label={`${t('pj.withdraw')}: ${title}`} onClick={() => dispatch({ type: 'withdraw', id: a.id })}>{t('pj.withdraw')}</button>
                        )}
                      </div>
                    </div>
                    <div className="row-side"><StatusBadge status={a.status} /></div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <Dialog open={!!openProject} onClose={() => setOpenId(null)} title={openProject ? loc(openProject.title, language) : ''} variant="drawer">
        {openProject && <DrawerBody key={openProject.id} project={openProject} onClose={() => setOpenId(null)} />}
      </Dialog>
    </>
  );
}

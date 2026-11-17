'use client';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { SAMPLE_PROJECTS } from '../../../lib/sampleProjects';
import { ACTIVE_PROJECTS, ACTIVITY, SAMPLE_REFERENCE, loc } from '../../../lib/sampleApp';
import { useApp } from '../../../components/app/AppState';
import { PageHeader, Section, StatusBadge, Progress, formatDate, fold } from '../../../components/app/Common';

const budgetText = (b) => `$${b.min}–$${b.max}`;

export default function DashboardPage() {
  usePageTitle('app.nav.dashboard');
  const { t, language } = useLanguage();
  const { state, checklist, completion, counts } = useApp();

  const nextSteps = checklist.filter((c) => !c.done);

  // Recommended = open projects you have not applied to, ranked by how many skills match your profile.
  const mine = new Set(state.skills.map((s) => fold(s.name)));
  const applied = new Set(state.applications.filter((a) => a.status !== 'withdrawn').map((a) => a.projectId));
  const recommended = SAMPLE_PROJECTS
    .filter((p) => !applied.has(p.id))
    .map((p) => ({ p, match: p.skills.filter((s) => mine.has(fold(s))).length }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  const apps = state.applications.slice(0, 3).map((a) => ({ a, p: SAMPLE_PROJECTS.find((x) => x.id === a.projectId) })).filter((x) => x.p);

  return (
    <>
      <PageHeader title={`${t('dash.welcome')} ${state.user.name}`} lead={t('dash.lead')} />

      <div className="dash-grid">
        <div className="stack">
          <Section id="next" title={t('dash.next')}>
            {nextSteps.length === 0 ? (
              <p className="empty">{t('dash.next.empty')}</p>
            ) : (
              <ul className="rows">
                {nextSteps.map((s) => (
                  <li key={s.id} className="row row-inline">
                    <span className="step-dot" aria-hidden="true" />
                    <div className="row-main"><p className="row-title">{t(s.key)}</p></div>
                    <Link className="btn btn-secondary btn-sm" href={s.href}>{t('common.go')}</Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="recommended" title={t('dash.recommended')} action={<Link className="text-link" href="/projects">{t('common.viewAll')}</Link>}>
            <ul className="rows">
              {recommended.map(({ p, match }) => (
                <li key={p.id} className="row">
                  <div className="row-main">
                    <h3 className="row-title">{loc(p.title, language)}</h3>
                    <p className="row-meta">{t(`cat.${p.category}`)} · {budgetText(p.budget)} · {p.budget.unit === 'hour' ? t('projects.hourly') : t('projects.fixed')}</p>
                    {match > 0 && <p className="match-note">{match} {match === 1 ? t('pj.skillMatch') : t('pj.skillsMatch')}</p>}
                  </div>
                  <Link className="btn btn-secondary btn-sm" href={`/projects?project=${p.id}`}>{t('pj.details')}</Link>
                </li>
              ))}
            </ul>
            <p className="sample-note">{t('projects.sample')}</p>
          </Section>

          <Section id="active" title={t('dash.active')}>
            {ACTIVE_PROJECTS.length === 0 ? (
              <p className="empty">{t('dash.active.empty')}</p>
            ) : (
              <ul className="rows">
                {ACTIVE_PROJECTS.map((a) => (
                  <li key={a.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{loc(a.title, language)}</h3>
                      <p className="row-meta">{loc(a.client, language)} · {t('dash.due')} {formatDate(a.due, language)}</p>
                      <p className="row-text">{t('dash.nextStep')}: {loc(a.next, language)}</p>
                    </div>
                    <div className="row-side"><StatusBadge status="inprogress" /></div>
                  </li>
                ))}
              </ul>
            )}
            <p className="sample-note">{t('common.sample')}</p>
          </Section>

          <Section id="applications" title={t('dash.applications')} action={<Link className="text-link" href="/projects#applications">{t('common.viewAll')}</Link>}>
            {apps.length === 0 ? (
              <p className="empty">{t('dash.applications.empty')}</p>
            ) : (
              <ul className="rows">
                {apps.map(({ a, p }) => (
                  <li key={a.id} className="row">
                    <div className="row-main">
                      <h3 className="row-title">{loc(p.title, language)}</h3>
                      <p className="row-meta">{t('pj.appliedOn')} {formatDate(a.when, language)}</p>
                    </div>
                    <div className="row-side"><StatusBadge status={a.status} /></div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="side-stack">
          <section className="panel" aria-labelledby="completion-h">
            <h2 className="panel-title" id="completion-h">{t('dash.completion')}</h2>
            <p className="stat-big">{completion.pct}<small>%</small></p>
            <Progress value={completion.done} max={completion.total} label={t('dash.completion')} />
            <p className="panel-note">{completion.done} / {completion.total} {t('dash.steps')}</p>
          </section>

          <section className="panel" aria-labelledby="verif-h">
            <h2 className="panel-title" id="verif-h">{t('dash.verification')}</h2>
            <dl className="kv">
              <div className="kv-row"><dt>{t('dash.verifiedEntries')}</dt><dd>{counts.verified}</dd></div>
              <div className="kv-row"><dt>{t('dash.pendingEntries')}</dt><dd>{counts.pending}</dd></div>
              <div className="kv-row"><dt>{t('dash.selfEntries')}</dt><dd>{counts.self}</dd></div>
            </dl>
          </section>

          <div>
            <div className="mini-cred on-dark">
              <p className="mini-cred-label">{t('cred.label')}</p>
              <p className="mini-cred-name">{state.user.name}</p>
              <p className="mini-cred-role">{loc(state.user.headline, language)}</p>
              <div className="mini-cred-foot">
                <span className="badge badge-verified">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                  {counts.verified} {t('dash.verifiedCount')}
                </span>
                <span className="mini-cred-ref">{t('cred.ref')} {SAMPLE_REFERENCE}</span>
              </div>
            </div>
            <p className="sample-note">{t('cred.sample')}</p>
            <p className="sample-note"><Link className="text-link" href="/profile#credentials">{t('dash.viewProfile')}</Link></p>
          </div>

          <section className="panel" aria-labelledby="activity-h">
            <h2 className="panel-title" id="activity-h">{t('dash.activity')}</h2>
            <ol className="activity">
              {ACTIVITY.map((ev) => (
                <li key={ev.id}>
                  <span className="when">{loc(ev.when, language)}</span>
                  {loc(ev.text, language)}
                </li>
              ))}
            </ol>
            <p className="sample-note">{t('common.sample')}</p>
          </section>
        </div>
      </div>
    </>
  );
}

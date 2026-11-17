'use client';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { TRUST_FACTORS, loc } from '../../../lib/sampleApp';
import { PageHeader, Progress, Section } from '../../../components/app/Common';

// The scoring system is not implemented. Every number here comes from lib/sampleApp.js and is labelled as an example.
const factorStatus = (f) => (f.earned >= f.max ? 'done' : f.earned > 0 ? 'partial' : 'todo');
const BADGE = { done: 'badge-ok badge-dot', partial: 'badge-pending', todo: 'badge-neutral badge-dot' };

export default function TrustPage() {
  usePageTitle('app.nav.trust');
  const { t, language } = useLanguage();

  const total = TRUST_FACTORS.reduce((n, f) => n + f.earned, 0);
  const max = TRUST_FACTORS.reduce((n, f) => n + f.max, 0);
  const open = TRUST_FACTORS.filter((f) => f.earned < f.max);

  return (
    <>
      <PageHeader title={t('app.nav.trust')} lead={t('ts.lead')} />
      <p className="notice" role="note"><strong>{t('common.sample')}.</strong> {t('ts.illustrative')}</p>

      <div className="score-grid" style={{ marginTop: 24 }}>
        <section className="panel" aria-labelledby="score-h">
          <h2 className="panel-title" id="score-h">{t('ts.score')}</h2>
          <p className="score-num">{total}<small> / {max}</small></p>
          <Progress value={total} max={max} label={t('ts.score')} />
          <p className="panel-note">{t('ts.outOf')} · {t('ts.example')}</p>
        </section>
        <section className="panel" aria-labelledby="how-h">
          <h2 className="panel-title" id="how-h">{t('ts.how')}</h2>
          <p>{t('ts.howText')}</p>
        </section>
      </div>

      <div className="stack" style={{ marginTop: 36 }}>
        <Section id="factors" title={t('ts.factors')}>
          <div className="table-wrap">
            <table className="table">
              <caption className="visually-hidden">{t('ts.factors')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('ts.factor')}</th>
                  <th scope="col" className="num">{t('ts.points')}</th>
                  <th scope="col">{t('ts.status')}</th>
                </tr>
              </thead>
              <tbody>
                {TRUST_FACTORS.map((f) => {
                  const st = factorStatus(f);
                  return (
                    <tr key={f.id}>
                      <td>
                        <p className="factor-name">{loc(f.name, language)}</p>
                        <p className="factor-text">{loc(f.text, language)}</p>
                      </td>
                      <td className="num">{f.earned} / {f.max}</td>
                      <td><span className={`badge ${BADGE[st]}`}>{t(`ts.${st}`)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {open.length > 0 && (
          <Section id="raise" title={t('ts.next')}>
            <ul className="raise-list">
              {open.map((f) => (
                <li key={f.id}>
                  <div>
                    <p className="factor-name">{loc(f.name, language)} <span className="raise-pts">+{f.max - f.earned} {t('ts.pts')}</span></p>
                    <p className="factor-text">{loc(f.action, language)}</p>
                  </div>
                  {f.href && <Link className="btn btn-secondary btn-sm" href={f.href}>{t('common.go')}</Link>}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </>
  );
}

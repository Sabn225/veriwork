'use client';
import Link from 'next/link';
import HeroVideo from '../components/HeroVideo';
import { useEffect, useRef } from 'react';
import HowItWorks from '../components/HowItWorks';
import ProjectExplorer from '../components/ProjectExplorer';
import { useLanguage } from '../lib/LanguageContext';
import './landing.css';

const CHECK = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
const VALUES = [
  { k: 'value1', icon: <><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></> },
  { k: 'value2', icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 10h4M7 14h6" /></> },
  { k: 'value3', icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></> },
  { k: 'value4', icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" /></> },
];
const SAMPLE_SKILLS = ['Copywriting', 'SEO', 'Editing'];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main id="main">
      {/* Hero: copy on the left, cinematic video on the right, with a floating credential chip tying the two together */}
      <section className="hero" id="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{t('hero.eyebrow')}</p>
            <h1 id="hero-title" className="hero-title">{t('hero.title')}</h1>
            <p className="hero-text">{t('hero.text')}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" href="/signup">{t('hero.cta1')}</Link>
              <Link className="btn btn-secondary btn-lg" href="/#features">{t('hero.cta2')}</Link>
            </div>
          </div>

          <div className="hero-media">
            <HeroVideo />
            {/* Decorative: the full credential is shown further down the page */}
            <div className="hero-chip on-dark" aria-hidden="true">
              <span className="hero-chip-avatar">N</span>
              <div className="hero-chip-id">
                <p className="hero-chip-name">Liam Nguyen</p>
                <p className="hero-chip-role">{t('cred.role')}</p>
              </div>
              <span className="badge badge-verified">{CHECK}{t('cred.badge')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="section" id="features" aria-labelledby="features-title">
        <div className="container">
          <header className="section-head-row">
            <h2 id="features-title" className="section-title">{t('features.title')}</h2>
            <p className="section-lead">{t('features.lead')}</p>
          </header>
          <ul className="value-grid">
            {VALUES.map(({ k, icon }) => (
              <li key={k} className="value-item">
                <svg className="value-icon" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
                <h3 className="value-title">{t(`${k}.title`)}</h3>
                <p className="value-text">{t(`${k}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works: scroll-reactive timeline */}
      <HowItWorks />

      {/* Digital credential showcase (sample data, labelled as such) */}
      <section className="section" id="credential" aria-labelledby="cred-title">
        <div className="container cred-grid">
          <div className="cred-copy">
            <h2 id="cred-title" className="section-title">{t('cred.title')}</h2>
            <p className="section-lead">{t('cred.text')}</p>
            <ul className="cred-list">
              {['cred.item1', 'cred.item2', 'cred.item3'].map((k) => (
                <li key={k}>{CHECK}<span>{t(k)}</span></li>
              ))}
            </ul>
          </div>

          <div className="cred-stage">
            <article className="cred-card on-dark" aria-label={t('cred.label')}>
              <div className="cred-top">
                <span>{t('cred.label')}</span>
                <span className="badge badge-verified">{CHECK}{t('cred.badge')}</span>
              </div>

              <div className="cred-person">
                <div>
                  <p className="cred-name">Liam Nguyen</p>
                  <p className="cred-role">{t('cred.role')}</p>
                </div>
                <div className="qr" aria-hidden="true" />
              </div>

              <div className="cred-group">
                <p className="cred-group-title"><span className="badge badge-verified">{CHECK}{t('cred.badge')}</span></p>
                <ul className="cred-entries">
                  {['cred.v1', 'cred.v2'].map((k) => (
                    <li key={k} className="is-verified">{CHECK}<span>{t(k)}</span></li>
                  ))}
                </ul>
              </div>

              <div className="cred-group">
                <p className="cred-group-title"><span className="badge badge-self">{t('cred.selfTitle')}</span></p>
                <ul className="cred-entries">
                  <li className="is-self"><i className="ring" aria-hidden="true" /><span>{t('cred.s1')}</span></li>
                </ul>
              </div>

              <div className="cred-group">
                <p className="cred-group-title cred-group-plain">{t('cred.skillsTitle')}</p>
                <ul className="cred-skills">
                  {SAMPLE_SKILLS.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>

              <p className="cred-foot">{t('cred.ref')}: VW-0000-0000</p>
            </article>
            <p className="cred-note">{t('cred.sample')}</p>
          </div>
        </div>
      </section>

      {/* Projects and opportunities: search, filter, details, apply */}
      <ProjectExplorer />

      {/* Trust: only what the product copy already commits to */}
      <section className="section section-dark on-dark" id="trust" aria-labelledby="trust-title">
        <div className="container split">
          <div className="trust-intro">
            <h2 id="trust-title" className="section-title">{t('trust.title')}</h2>
            <p className="section-lead">{t('trust.lead')}</p>

            <div className="legend">
              <p className="legend-title">{t('trust.legendTitle')}</p>
              <dl>
                <div className="legend-row">
                  <dt><span className="badge badge-verified">{CHECK}{t('cred.badge')}</span></dt>
                  <dd>{t('trust.verifiedText')}</dd>
                </div>
                <div className="legend-row">
                  <dt><span className="badge badge-self">{t('cred.selfTitle')}</span></dt>
                  <dd>{t('trust.selfText')}</dd>
                </div>
              </dl>
            </div>
          </div>

          <ul className="principles">
            {['trust.p1', 'trust.p2', 'trust.p3'].map((k) => (
              <li key={k} className="principle">
                <h3 className="principle-title">{t(`${k}.title`)}</h3>
                <p className="principle-text">{t(`${k}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Community: honest placeholders until real stories exist */}
      <section className="section" id="community" aria-labelledby="community-title">
        <div className="container">
          <header className="section-head-row">
            <h2 id="community-title" className="section-title">{t('community.title')}</h2>
            <p className="section-lead">{t('community.text')}</p>
          </header>
          <ul className="slots">
            {[0, 1, 2].map((i) => (
              <li key={i} className="slot">
                <span className="slot-avatar" aria-hidden="true" />
                <span className="slot-lines" aria-hidden="true"><i /><i /><i /></span>
                <p className="slot-label">{t('community.slot')}</p>
              </li>
            ))}
          </ul>
          <Link className="btn btn-secondary community-cta" href="/signup">{t('community.cta')}</Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section cta-section" id="cta" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2 id="cta-title" className="cta-title">{t('cta.title')}</h2>
              <p className="cta-text">{t('cta.text')}</p>
              <Link className="btn btn-primary btn-lg" href="/signup">{t('cta.button')}</Link>
            </div>
            <img className="cta-img" src="/cta-image.png" alt={t('cta.imgAlt')} width="800" height="600" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>
    </main>
  );
}

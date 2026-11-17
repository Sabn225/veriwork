'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { changePassword } from '../../../lib/auth';
import { authErrorMessage } from '../../../components/auth/authErrors';
import { loc } from '../../../lib/sampleApp';
import { useApp } from '../../../components/app/AppState';
import { PageHeader } from '../../../components/app/Common';
import Tabs, { panelId, tabId } from '../../../components/app/Tabs';
import TextField from '../../../components/Field';

const TAB_IDS = ['account', 'profile', 'security', 'privacy', 'notifications', 'appearance', 'language'];

// ---------- shared bits ----------
function Saved({ show }) {
  const { t } = useLanguage();
  return <p className="form-alert" data-tone="success" role="status" hidden={!show}>{show ? t('common.saved') : ''}</p>;
}

function Toggle({ id, label, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <span className="toggle-label" id={`${id}-l`}>{label}</span>
        <span className="toggle-desc" id={`${id}-d`}>{desc}</span>
      </div>
      <button type="button" role="switch" className="switch" aria-checked={checked} aria-labelledby={`${id}-l`} aria-describedby={`${id}-d`} onClick={() => onChange(!checked)} />
    </div>
  );
}

// ---------- panels (each one mounts fresh, so its form state resets when you switch tabs) ----------
function AccountPanel() {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.user.name);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError(t('form.required')); setSaved(false); return; }
    dispatch({ type: 'user', patch: { name: name.trim() } });
    setError(''); setSaved(true);
  };

  return (
    <form className="set-form" noValidate onSubmit={submit}>
      <TextField label={t('form.name')} name="name" value={name} required error={error} autoComplete="name" onChange={(e) => { setName(e.target.value); setSaved(false); setError(''); }} />
      <TextField label={t('form.email')} name="email" type="email" value={state.user.email} readOnly hint={t('set.emailHint')} />
      <button type="submit" className="btn btn-primary">{t('common.save')}</button>
      <Saved show={saved} />
    </form>
  );
}

function ProfilePanel() {
  const { t, language } = useLanguage();
  const { state, dispatch } = useApp();
  const [v, setV] = useState({ headline: loc(state.user.headline, language), location: state.user.location, about: loc(state.user.about, language) });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setSaved(false); };

  const submit = (e) => {
    e.preventDefault();
    dispatch({ type: 'user', patch: { headline: v.headline.trim(), location: v.location.trim(), about: v.about.trim() } });
    setSaved(true);
  };

  return (
    <form className="set-form" noValidate onSubmit={submit}>
      <TextField label={t('form.headline')} name="headline" value={v.headline} onChange={set('headline')} />
      <TextField label={t('form.location')} name="location" value={v.location} onChange={set('location')} />
      <TextField as="textarea" rows={6} label={t('form.about')} name="about" value={v.about} onChange={set('about')} />
      <button type="submit" className="btn btn-primary">{t('common.save')}</button>
      <Saved show={saved} />
    </form>
  );
}

function SecurityPanel() {
  const { t } = useLanguage();
  const [v, setV] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null); // { tone, text }
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!v.current) next.current = t('form.required');
    if (v.next.length < 8) next.next = t('err.passwordShort');
    if (v.confirm !== v.next) next.confirm = t('err.passwordMatch');
    setErrors(next);
    setAlert(null);
    if (Object.keys(next).length) {
      const first = ['current', 'next', 'confirm'].find((k) => next[k]);
      requestAnimationFrame(() => document.querySelector(`[name="${first}"]`)?.focus());
      return;
    }
    setBusy(true);
    try {
      await changePassword({ currentPassword: v.current, newPassword: v.next });
      setAlert({ tone: 'success', text: t('auth.resetDone') });
      setV({ current: '', next: '', confirm: '' });
    } catch (err) {
      setAlert({ tone: 'error', text: authErrorMessage(err, t) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="set-form" noValidate onSubmit={submit}>
      <TextField type="password" label={t('auth.currentPassword')} name="current" value={v.current} onChange={set('current')} error={errors.current} required autoComplete="current-password" />
      <TextField type="password" label={t('auth.newPassword')} name="next" value={v.next} onChange={set('next')} error={errors.next} hint={t('auth.passwordHint')} required autoComplete="new-password" />
      <TextField type="password" label={t('auth.confirmPassword')} name="confirm" value={v.confirm} onChange={set('confirm')} error={errors.confirm} required autoComplete="new-password" />
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? t('auth.wait') : t('set.updatePassword')}</button>
      {alert && <p className="form-alert" data-tone={alert.tone} role={alert.tone === 'error' ? 'alert' : 'status'}>{alert.text}</p>}
    </form>
  );
}

function PrefsPanel({ group, keys }) {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  return (
    <div className="toggle-list">
      {keys.map((k) => (
        <Toggle
          key={k}
          id={`${group}-${k}`}
          label={t(`set.${group}.${k}`)}
          desc={t(`set.${group}.${k}Text`)}
          checked={!!state.prefs[group][k]}
          onChange={(value) => dispatch({ type: 'pref', group, key: k, value })}
        />
      ))}
    </div>
  );
}

const readTheme = () => {
  try {
    const v = localStorage.getItem('veriwork-theme');
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch (e) { return 'system'; }
};

function AppearancePanel() {
  const { t } = useLanguage();
  const [mode, setMode] = useState('system');

  // Follow the saved choice, and stay in sync when the theme is changed from the top-bar toggle.
  useEffect(() => {
    setMode(readTheme());
    const mo = new MutationObserver(() => setMode(readTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  // In System mode the page tracks the OS setting live.
  useEffect(() => {
    if (mode !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [mode]);

  const choose = (m) => {
    const root = document.documentElement;
    try {
      if (m === 'system') localStorage.removeItem('veriwork-theme');
      else localStorage.setItem('veriwork-theme', m);
    } catch (e) { /* storage unavailable: the choice still applies for this visit */ }
    setMode(m);
    root.setAttribute('data-theme', m === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : m);
  };

  return (
    <fieldset className="fieldset">
      <legend className="visually-hidden">{t('set.appearance')}</legend>
      <div className="options">
        {['light', 'dark', 'system'].map((m) => (
          <label key={m} className="option">
            <input type="radio" name="theme" value={m} checked={mode === m} onChange={() => choose(m)} />
            {t(`set.theme.${m}`)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function LanguagePanel() {
  const { t, language, changeLanguage, LANGUAGES } = useLanguage();
  return (
    <fieldset className="fieldset">
      <legend className="visually-hidden">{t('set.language')}</legend>
      <div className="options">
        {LANGUAGES.map((l) => (
          <label key={l.code} className="option">
            <input type="radio" name="language" value={l.code} checked={language === l.code} onChange={() => changeLanguage(l.code)} />
            {l.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function SettingsPage() {
  usePageTitle('app.nav.settings');
  const { t } = useLanguage();
  const [tab, setTab] = useState('account');
  const panelRef = useRef(null);

  // /settings#security opens that tab; the hash follows the tab you pick.
  useEffect(() => {
    const read = () => { const h = window.location.hash.slice(1); if (TAB_IDS.includes(h)) setTab(h); };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const change = (id) => {
    setTab(id);
    try { window.history.replaceState(null, '', `#${id}`); } catch (e) { /* ignore */ }
  };

  return (
    <>
      <PageHeader title={t('app.nav.settings')} lead={t('set.lead')} />
      <div className="set-grid">
        <Tabs idPrefix="set" vertical label={t('set.nav')} tabs={TAB_IDS.map((id) => ({ id, label: t(`set.${id}`) }))} value={tab} onChange={change} />
        <div className="set-panel" ref={panelRef} role="tabpanel" id={panelId('set', tab)} aria-labelledby={tabId('set', tab)} tabIndex={0}>
          <h2 className="set-title">{t(`set.${tab}`)}</h2>
          <p className="set-text">{t(`set.${tab}Text`)}</p>
          {tab === 'account' && <AccountPanel />}
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'security' && <SecurityPanel />}
          {tab === 'privacy' && <PrefsPanel group="privacy" keys={['publicProfile', 'showSelfDeclared', 'showEmail']} />}
          {tab === 'notifications' && <PrefsPanel group="notifications" keys={['matches', 'applications', 'verification', 'news']} />}
          {tab === 'appearance' && <AppearancePanel />}
          {tab === 'language' && <LanguagePanel />}
        </div>
      </div>
    </>
  );
}

'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { signIn } from '../../../lib/auth';
import TextField from '../../../components/Field';
import { authErrorMessage, isEmail } from '../../../components/auth/authErrors';

export default function LoginPage() {
  usePageTitle('auth.loginTitle');
  const { t } = useLanguage();
  const router = useRouter();
  const formRef = useRef(null);
  const [v, setV] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isEmail(v.email)) next.email = t('err.email');
    if (!v.password) next.password = t('form.required');
    setErrors(next);
    if (Object.keys(next).length) {
      setAlert(t('err.summary'));
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setAlert('');
    setBusy(true);
    try {
      await signIn({ email: v.email.trim(), password: v.password });
      router.push('/dashboard');
    } catch (err) {
      setAlert(authErrorMessage(err, t));
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">{t('auth.loginTitle')}</h1>
      <p className="auth-lead">{t('auth.loginLead')}</p>

      <form className="auth-form" noValidate onSubmit={submit} ref={formRef}>
        {alert && <p className="form-alert" data-tone="error" role="alert">{alert}</p>}
        <TextField type="email" name="email" label={t('auth.email')} value={v.email} onChange={set('email')} error={errors.email} required autoComplete="email" inputMode="email" />
        <TextField type="password" name="password" label={t('auth.password')} value={v.password} onChange={set('password')} error={errors.password} required autoComplete="current-password" />
        <div className="auth-row"><Link className="auth-link" href="/forgot-password">{t('auth.forgot')}</Link></div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? t('auth.wait') : t('auth.login')}</button>
      </form>

      <p className="auth-alt">{t('auth.noAccount')} <Link href="/signup">{t('auth.signup')}</Link></p>
    </>
  );
}

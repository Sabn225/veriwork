'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { signUp } from '../../../lib/auth';
import TextField from '../../../components/Field';
import { authErrorMessage, isEmail } from '../../../components/auth/authErrors';

export default function SignupPage() {
  usePageTitle('auth.signupTitle');
  const { t } = useLanguage();
  const router = useRouter();
  const formRef = useRef(null);
  const [v, setV] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!v.name.trim()) next.name = t('form.required');
    if (!isEmail(v.email)) next.email = t('err.email');
    if (v.password.length < 8) next.password = t('err.passwordShort');
    setErrors(next);
    if (Object.keys(next).length) {
      setAlert(t('err.summary'));
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setAlert('');
    setBusy(true);
    try {
      await signUp({ name: v.name.trim(), email: v.email.trim(), password: v.password });
      router.push('/dashboard');
    } catch (err) {
      setAlert(authErrorMessage(err, t));
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">{t('auth.signupTitle')}</h1>
      <p className="auth-lead">{t('auth.signupLead')}</p>

      <form className="auth-form" noValidate onSubmit={submit} ref={formRef}>
        {alert && <p className="form-alert" data-tone="error" role="alert">{alert}</p>}
        <TextField name="name" label={t('auth.name')} value={v.name} onChange={set('name')} error={errors.name} required autoComplete="name" />
        <TextField type="email" name="email" label={t('auth.email')} value={v.email} onChange={set('email')} error={errors.email} required autoComplete="email" inputMode="email" />
        <TextField type="password" name="password" label={t('auth.password')} value={v.password} onChange={set('password')} error={errors.password} hint={t('auth.passwordHint')} required autoComplete="new-password" />
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? t('auth.wait') : t('auth.signupSubmit')}</button>
      </form>

      <p className="auth-alt">{t('auth.haveAccount')} <Link href="/login">{t('auth.login')}</Link></p>
    </>
  );
}

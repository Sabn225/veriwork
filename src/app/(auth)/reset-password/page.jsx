'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { usePageTitle } from '../../../lib/usePageTitle';
import { resetPassword } from '../../../lib/auth';
import TextField from '../../../components/Field';
import { authErrorMessage } from '../../../components/auth/authErrors';

// The reset link carries the token as /reset-password?token=…  Without one there is nothing to reset.
function ResetForm() {
  usePageTitle('auth.resetTitle');
  const { t } = useLanguage();
  const token = useSearchParams().get('token') || '';
  const formRef = useRef(null);
  const [v, setV] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }); };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (v.password.length < 8) next.password = t('err.passwordShort');
    if (v.confirm !== v.password) next.confirm = t('err.passwordMatch');
    setErrors(next);
    if (Object.keys(next).length) {
      setAlert(t('err.summary'));
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setAlert('');
    setBusy(true);
    try {
      await resetPassword({ token, password: v.password });
      setDone(true);
    } catch (err) {
      setAlert(authErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <>
        <h1 className="auth-title">{t('auth.resetTitle')}</h1>
        <div className="auth-form">
          <p className="form-alert" data-tone="error" role="alert">{t('auth.resetNoToken')}</p>
          <Link className="btn btn-primary btn-lg" href="/forgot-password">{t('auth.requestNew')}</Link>
        </div>
      </>
    );
  }

  if (done) {
    return (
      <>
        <h1 className="auth-title">{t('auth.resetTitle')}</h1>
        <div className="auth-form">
          <p className="form-alert" data-tone="success" role="status">{t('auth.resetDone')}</p>
          <Link className="btn btn-primary btn-lg" href="/login">{t('auth.login')}</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="auth-title">{t('auth.resetTitle')}</h1>
      <p className="auth-lead">{t('auth.resetLead')}</p>
      <form className="auth-form" noValidate onSubmit={submit} ref={formRef}>
        {alert && <p className="form-alert" data-tone="error" role="alert">{alert}</p>}
        <TextField type="password" name="password" label={t('auth.newPassword')} value={v.password} onChange={set('password')} error={errors.password} hint={t('auth.passwordHint')} required autoComplete="new-password" />
        <TextField type="password" name="confirm" label={t('auth.confirmPassword')} value={v.confirm} onChange={set('confirm')} error={errors.confirm} required autoComplete="new-password" />
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? t('auth.wait') : t('auth.resetSubmit')}</button>
      </form>
      <p className="auth-alt"><Link href="/login">{t('auth.backToLogin')}</Link></p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}

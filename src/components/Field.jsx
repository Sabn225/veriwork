'use client';
import { useId, useState } from 'react';
import { useLanguage } from '../lib/LanguageContext';

// One labelled form control: input, textarea or select, with hint, error and (for passwords) a show/hide button.
// The label is always visible; errors and hints are tied to the control with aria-describedby.
export default function TextField({
  label, name, type = 'text', as = 'input', value, onChange, error, hint,
  required = false, optional = false, options = [], rows, controlProps = {}, ...rest
}) {
  const { t } = useLanguage();
  const uid = useId();
  const id = `${uid}-f`;
  const hintId = hint ? `${uid}-h` : undefined;
  const errId = error ? `${uid}-e` : undefined;
  const [shown, setShown] = useState(false);
  const isPassword = type === 'password';

  const common = {
    id, name, value, onChange,
    className: 'control',
    'aria-required': required || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': [hintId, errId].filter(Boolean).join(' ') || undefined,
    ...controlProps,
    ...rest,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea rows={rows || 4} {...common} />;
  } else if (as === 'select') {
    control = (
      <select {...common}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (isPassword) {
    control = (
      <div className="input-wrap">
        <input type={shown ? 'text' : 'password'} {...common} />
        <button type="button" className="input-toggle" aria-pressed={shown} aria-label={shown ? t('auth.hidePassword') : t('auth.showPassword')} onClick={() => setShown(!shown)}>
          {shown ? t('auth.hide') : t('auth.show')}
        </button>
      </div>
    );
  } else {
    control = <input type={type} {...common} />;
  }

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {optional && <span className="opt"> ({t('common.optional')})</span>}
      </label>
      {control}
      {hint && <p id={hintId} className="form-hint">{hint}</p>}
      {error && <p id={errId} className="form-error">{error}</p>}
    </div>
  );
}

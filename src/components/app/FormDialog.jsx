'use client';
import { useRef, useState } from 'react';
import Dialog from './Dialog';
import TextField from '../Field';
import { useLanguage } from '../../lib/LanguageContext';

// Config-driven form in a dialog.
// fields: [{ name, label, type: 'text'|'textarea'|'select'|'number'|'checks', required, optional, hint, options, emptyText, placeholder }]
// Required fields and numbers are validated here; the first invalid field is focused. onSubmit receives plain values.
function Body({ fields, initial, submitLabel, onSubmit, onClose }) {
  const { t } = useLanguage();
  const formRef = useRef(null);
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, initial?.[f.name] ?? (f.type === 'checks' ? [] : '')]))
  );
  const [errors, setErrors] = useState({});

  const set = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };
  const toggle = (name, v) => {
    const cur = values[name] || [];
    set(name, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    for (const f of fields) {
      if (f.type === 'checks') continue;
      const s = String(values[f.name] ?? '').trim();
      if (f.required && !s) next[f.name] = t('form.required');
      else if (f.type === 'number' && s && !(Number(s) > 0)) next[f.name] = t('form.number');
    }
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    const out = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === 'checks') out[f.name] = v;
      else if (f.type === 'number') out[f.name] = String(v).trim() === '' ? '' : Number(v);
      else out[f.name] = String(v).trim();
    }
    onSubmit(out);
    onClose();
  };

  return (
    <form className="dialog-form" noValidate onSubmit={submit} ref={formRef}>
      <div className="dialog-body">
        <div className="form-grid">
          {fields.map((f, i) => {
            if (f.type === 'checks') {
              return (
                <fieldset key={f.name} className="form-field fieldset">
                  <legend className="form-label">{f.label}</legend>
                  {f.hint && <p className="form-hint">{f.hint}</p>}
                  {(f.options || []).length === 0 ? (
                    <p className="form-hint">{f.emptyText}</p>
                  ) : (
                    <div className="checks">
                      {f.options.map((o) => (
                        <label key={o.value} className="check">
                          <input type="checkbox" checked={(values[f.name] || []).includes(o.value)} onChange={() => toggle(f.name, o.value)} />
                          <span>{o.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>
              );
            }
            const as = f.type === 'textarea' ? 'textarea' : f.type === 'select' ? 'select' : 'input';
            return (
              <TextField
                key={f.name}
                name={f.name}
                label={f.label}
                as={as}
                type={f.type === 'number' ? 'number' : 'text'}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
                error={errors[f.name]}
                hint={f.hint}
                required={f.required}
                optional={f.optional}
                options={f.options}
                placeholder={f.placeholder}
                controlProps={{
                  ...(i === 0 ? { 'data-autofocus': '' } : {}),
                  ...(f.type === 'number' ? { min: 1, step: 1, inputMode: 'numeric' } : {}),
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="dialog-foot">
        <button type="button" className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
        <button type="submit" className="btn btn-primary">{submitLabel || t('common.save')}</button>
      </div>
    </form>
  );
}

// The body only exists while the dialog is open, so its state starts fresh from `initial` every time.
export default function FormDialog({ open, onClose, title, ...rest }) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <Body {...rest} onClose={onClose} />
    </Dialog>
  );
}

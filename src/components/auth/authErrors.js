// Turns whatever lib/auth.js threw into a translated message. Codes are documented at the top of lib/auth.js.
const MAP = {
  NOT_CONNECTED: 'err.notConnected',
  INVALID_CREDENTIALS: 'err.credentials',
  EMAIL_TAKEN: 'err.emailTaken',
  INVALID_TOKEN: 'err.token',
};

export const authErrorMessage = (error, t) => t(MAP[error && error.code] || 'err.generic');

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

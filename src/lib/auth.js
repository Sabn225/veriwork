// THE ONE FILE TO CONNECT TO YOUR BACKEND.
// Every auth screen (login, signup, forgot/reset password) and the Security tab in Settings call these functions
// and nothing else. Until you implement them, each one rejects with NotConnectedError and the form shows an honest
// "not connected" message instead of pretending to work.
//
// To connect: replace the body of each function with a call to your API. Throw an Error to show a failure.
// Example (adjust the URL and payload to your backend):
//
//   export async function signIn({ email, password }) {
//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) throw withCode('INVALID_CREDENTIALS');
//     return res.json();
//   }
//
// Error codes the forms understand (anything else shows a generic "something went wrong"):
//   NOT_CONNECTED, INVALID_CREDENTIALS (login), EMAIL_TAKEN (signup), INVALID_TOKEN (reset password).

export class NotConnectedError extends Error {
  constructor() {
    super('NOT_CONNECTED');
    this.code = 'NOT_CONNECTED';
  }
}

// Helper for your own implementations: withCode('EMAIL_TAKEN') returns an Error the forms can translate.
export const withCode = (code) => Object.assign(new Error(code), { code });

const notConnected = () => Promise.reject(new NotConnectedError());

export const signIn = ({ email, password }) => notConnected();
export const signUp = ({ name, email, password }) => notConnected();
export const requestPasswordReset = ({ email }) => notConnected();
export const resetPassword = ({ token, password }) => notConnected();
export const changePassword = ({ currentPassword, newPassword }) => notConnected();

// No session exists yet, so signing out has nothing to clear. Add your logout call here.
export const signOut = () => Promise.resolve();

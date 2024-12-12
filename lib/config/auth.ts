// Authentication configuration
export const AUTH_CONFIG = {
  COOKIE_NAME: 'auth',
  COOKIE_OPTIONS: {
    expires: 7,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  DEFAULT_REDIRECT: '/schedule',
};
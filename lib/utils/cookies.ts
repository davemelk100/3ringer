import Cookies from 'js-cookie';
import { AUTH_CONFIG } from '@/lib/config/auth';

export const cookieUtils = {
  set: () => {
    Cookies.set(
      AUTH_CONFIG.COOKIE_NAME, 
      'true', 
      AUTH_CONFIG.COOKIE_OPTIONS
    );
  },
  
  remove: () => {
    Cookies.remove(AUTH_CONFIG.COOKIE_NAME, { 
      path: AUTH_CONFIG.COOKIE_OPTIONS.path 
    });
  },
};
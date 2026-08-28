import { HttpInterceptorFn } from '@angular/common/http';

// Populated by src/env.js, which loads before this bundle - see that file
// for why this is a runtime script rather than a build-time environment.ts.
declare global {
  interface Window {
    __env__?: { apiUrl?: string };
  }
}

// Falls back to the public demo API only if env.js somehow failed to load,
// so the app degrades to "still works" rather than "blank page".
const DEFAULT_API_URL = 'https://api.realworld.show/api';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = window.__env__?.apiUrl ?? DEFAULT_API_URL;
  const apiReq = req.clone({ url: `${apiUrl}${req.url}` });
  return next(apiReq);
};

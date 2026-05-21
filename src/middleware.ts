import { defineMiddleware } from 'astro:middleware';

// Protected path prefix
const PROTECTED = '/proposals/';
const LOGIN_PATH = '/login';
const COOKIE_NAME = 'aonikenk_auth';

// Each proposal can have its own access code stored as an env var.
// Format: PROPOSAL_CODE_<SLUG> e.g. PROPOSAL_CODE_AF_SERVICIOS_MINEROS
// Fallback: PROPOSAL_CODE_DEFAULT covers all proposals.
//
// Set these in Vercel → Project Settings → Environment Variables.
// Never hardcode codes here.

function getValidCode(slug: string): string | undefined {
  const key = `PROPOSAL_CODE_${slug.toUpperCase().replace(/-/g, '_')}`;
  return import.meta.env[key] ?? import.meta.env.PROPOSAL_CODE_DEFAULT;
}

function slugFromPath(pathname: string): string {
  // /proposals/af-servicios-mineros → af-servicios-mineros
  return pathname.replace(PROTECTED, '').split('/')[0] ?? 'default';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /proposals/* — let login page and assets through
  if (!pathname.startsWith(PROTECTED)) {
    return next();
  }

  const slug      = slugFromPath(pathname);
  const validCode = getValidCode(slug);
  const cookie    = context.cookies.get(COOKIE_NAME);

  // Valid session cookie → allow through
  if (cookie && validCode && cookie.value === validCode) {
    return next();
  }

  // No valid session → redirect to login, preserving the target URL
  const loginUrl = new URL(LOGIN_PATH, context.url);
  loginUrl.searchParams.set('redirect', pathname);
  return context.redirect(loginUrl.toString(), 302);
});

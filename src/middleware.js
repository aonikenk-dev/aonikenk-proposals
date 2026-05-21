export async function onRequest(context, next) {
  const PROTECTED   = '/proposals/';
  const LOGIN_PATH  = '/login';
  const COOKIE_NAME = 'aonikenk_auth';

  const { pathname } = context.url;

  if (!pathname.startsWith(PROTECTED)) {
    return next();
  }

  const slug      = pathname.replace(PROTECTED, '').split('/')[0] ?? 'default';
  const envKey    = `PROPOSAL_CODE_${slug.toUpperCase().replace(/-/g, '_')}`;
  const validCode = context.locals.runtime?.env?.[envKey]
                 ?? context.locals.runtime?.env?.PROPOSAL_CODE_DEFAULT
                 ?? import.meta.env?.[envKey]
                 ?? import.meta.env?.PROPOSAL_CODE_DEFAULT;

  const cookie = context.cookies.get(COOKIE_NAME);

  if (cookie && validCode && cookie.value === validCode) {
    return next();
  }

  const loginUrl = new URL(LOGIN_PATH, context.url);
  loginUrl.searchParams.set('redirect', pathname);
  return context.redirect(loginUrl.toString(), 302);
}

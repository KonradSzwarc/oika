import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, getRequestUrl, setCookie } from '@tanstack/react-start/server';
import { Seconds } from '@/common/models/seconds';
import { serverEnv } from '@/services/env/server';

const PASSWORD_COOKIE_NAME = 'site-key';

export const validatePasswordCookie = createServerFn().handler(async () => {
  const url = getRequestUrl();
  const cookieSearchParam = url.searchParams.get('cookie');

  const isSearchParamValid = cookieSearchParam === serverEnv.PASSWORD_COOKIE_VALUE;

  if (isSearchParamValid) {
    setCookie(PASSWORD_COOKIE_NAME, cookieSearchParam, {
      path: '/',
      maxAge: Seconds.fromString('30 days'),
      httpOnly: true,
      secure: serverEnv.VITE_APP_ENV !== 'local',
    });
  }

  const isCookieValid = getCookie(PASSWORD_COOKIE_NAME) === serverEnv.PASSWORD_COOKIE_VALUE;

  return { hasPasswordCookie: isSearchParamValid || isCookieValid };
});

export const assertHasPasswordCookie = createServerFn().handler(async () => {
  const url = getRequestUrl();
  const cookie = getCookie(PASSWORD_COOKIE_NAME);

  if (cookie !== serverEnv.PASSWORD_COOKIE_VALUE && url.pathname !== '/') {
    throw redirect({ to: '/' });
  }
});
